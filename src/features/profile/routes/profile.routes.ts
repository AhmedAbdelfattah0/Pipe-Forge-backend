/**
 * profile.routes.ts
 *
 * User profile feature routes — all protected by `authMiddleware`.
 *
 * Mounted at: `/api/profile`
 *
 * Routes:
 *   GET   /api/profile        — return current user's profile
 *   PATCH /api/profile        — update profile fields
 *   POST  /api/profile/avatar — upload avatar to Supabase Storage
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { createSupabaseAdmin } from '../../../config/supabase.js';
import { ProfileRepository } from '../repositories/profile.repository.js';
import { AppError } from '../../../shared/utils/app-error.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';

/** Zod schema for profile PATCH — validates and constrains every allowed field. */
const ProfileUpdateSchema = z.object({
  full_name: z.string().max(200).optional(),
  display_name: z.string().max(100).optional(),
  job_title: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
  linkedin_url: z.string().max(500).url().optional().or(z.literal('')),
  avatar_url: z.string().max(1000).url().optional().or(z.literal('')),
  ado_organization: z.string().max(200).regex(/^[a-zA-Z0-9 _-]*$/).optional(),
  ado_project: z.string().max(200).regex(/^[a-zA-Z0-9 _.-]*$/).optional(),
  default_platform: z.enum(['azure-devops', 'github-actions']).optional(),
  github_username: z.string().max(100).regex(/^[a-zA-Z0-9-]*$/).optional(),
}).strict();

export function profileRoutes() {
  const app = new Hono<HonoEnv>();

  // ─── GET / ──────────────────────────────────────────────────────────────────

  app.get('/', async (c) => {
    const userId = c.get('userId');
    const email = c.get('userEmail');
    const supabase = createSupabaseAdmin(c.env);
    const repo = new ProfileRepository(supabase);

    let profile = await repo.findById(userId);

    // Auto-create profile on first access (if trigger didn't fire).
    if (!profile) {
      profile = await repo.upsert(userId, {});
    }

    return c.json({ profile: { ...profile, email } });
  });

  // ─── PATCH / ────────────────────────────────────────────────────────────────

  app.patch('/', async (c) => {
    const userId = c.get('userId');
    const email = c.get('userEmail');
    const body = await c.req.json();
    const supabase = createSupabaseAdmin(c.env);
    const repo = new ProfileRepository(supabase);

    // Validate and constrain allowed fields — rejects unknown keys and invalid values.
    const result = ProfileUpdateSchema.safeParse(body);
    if (!result.success) {
      throw new AppError('Invalid profile data: ' + result.error.issues.map(i => i.message).join(', '), 400);
    }

    const profile = await repo.upsert(userId, result.data);

    return c.json({ profile: { ...profile, email } });
  });

  // ─── POST /avatar ───────────────────────────────────────────────────────────

  app.post('/avatar', async (c) => {
    const userId = c.get('userId');
    const email = c.get('userEmail');
    const supabase = createSupabaseAdmin(c.env);
    const repo = new ProfileRepository(supabase);

    const formData = await c.req.formData();
    const entry = formData.get('avatar');

    if (!entry || typeof entry === 'string') {
      return c.json({ status: 'error', message: 'No file provided' }, 400);
    }

    // Workers FormData returns a File (extends Blob).
    const file = entry as unknown as { name: string; type: string; size: number; arrayBuffer(): Promise<ArrayBuffer> };

    // Validate file type and size (max 2 MB).
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return c.json({ status: 'error', message: 'File must be under 2 MB' }, 400);
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ status: 'error', message: 'Only JPEG, PNG, and WebP files are allowed' }, 400);
    }

    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/avatar.${ext}`;
    const buffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return c.json({ status: 'error', message: `Upload failed: ${uploadError.message}` }, 500);
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);

    const avatarUrl = urlData.publicUrl;

    const profile = await repo.upsert(userId, { avatar_url: avatarUrl });

    return c.json({ profile: { ...profile, email }, avatarUrl });
  });

  return app;
}
