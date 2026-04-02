/**
 * Environment bindings type for Cloudflare Workers.
 * Secrets are set via `wrangler secret put` or Cloudflare dashboard.
 * Vars can be set in wrangler.toml [vars] section.
 */
export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ENCRYPTION_KEY: string;
  FRONTEND_URL: string;
  /** Anthropic API key — used by the AI Error Diagnosis feature (Task 23). */
  ANTHROPIC_API_KEY: string;
}
