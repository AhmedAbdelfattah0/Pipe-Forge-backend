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
  /** Gemini API key — used by the AI Error Diagnosis feature. */
  GEMINI_API_KEY: string;
}

/**
 * Environment bindings required by the webhook feature.
 * Extends Env so webhook routes can also access shared bindings.
 */
export interface WebhookEnv extends Env {
  /** HMAC-SHA256 secret shared with Notion for webhook signature verification. */
  NOTION_WEBHOOK_SECRET: string;
  /** Notion integration token used to fetch page content. */
  NOTION_API_KEY: string;
  /** Full Google Service Account JSON key (stringified). */
  GOOGLE_SERVICE_ACCOUNT_JSON: string;
  /** Google Drive folder ID where Markdown files are uploaded. */
  GOOGLE_DRIVE_FOLDER_ID: string;
  /**
   * Google account email to share the Drive folder with after service-account
   * creation, so the owner can browse files and use them in NotebookLM.
   * Optional — sharing is skipped if this binding is absent.
   */
  GOOGLE_OWNER_EMAIL?: string;
  /**
   * Google OAuth2 client ID for the personal Drive OAuth2 flow.
   * When present (alongside GOOGLE_CLIENT_SECRET + GOOGLE_REFRESH_TOKEN),
   * uploads use OAuth2 refresh-token auth instead of a service account,
   * which means files are stored in Ahmed's personal Drive quota.
   */
  GOOGLE_CLIENT_ID?: string;
  /** Google OAuth2 client secret. Pair with GOOGLE_CLIENT_ID. */
  GOOGLE_CLIENT_SECRET?: string;
  /**
   * Long-lived OAuth2 refresh token obtained from the auth-callback endpoint.
   * Generate once via GET /webhooks/google-drive/auth-start → auth-callback.
   */
  GOOGLE_REFRESH_TOKEN?: string;
}
