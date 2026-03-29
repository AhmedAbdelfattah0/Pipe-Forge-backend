import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './env.js';

/**
 * Supabase client initialised with the anon key.
 * Use for operations that respect Row Level Security policies (user-scoped reads/writes).
 */
export const supabaseAnon: SupabaseClient = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY,
);

/**
 * Supabase client initialised with the service-role key.
 * Bypasses RLS — use only for admin/server-side operations.
 * NEVER expose this client to the browser.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
