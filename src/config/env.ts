import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z
    .string()
    .default('3001')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive()),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  SUPABASE_URL: z.string().url({ message: 'SUPABASE_URL must be a valid URL' }),
  SUPABASE_ANON_KEY: z
    .string()
    .min(1, { message: 'SUPABASE_ANON_KEY is required' }),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, { message: 'SUPABASE_SERVICE_ROLE_KEY is required' }),
  FRONTEND_URL: z
    .string()
    .url({ message: 'FRONTEND_URL must be a valid URL' })
    .default('http://localhost:4200'),
  ENCRYPTION_KEY: z
    .string()
    .length(64, { message: 'ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)' })
    .regex(/^[0-9a-fA-F]+$/, { message: 'ENCRYPTION_KEY must be a hex string' }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌  Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

/** Validated, typed environment configuration. */
export const config = parsed.data;

export type Config = typeof config;
