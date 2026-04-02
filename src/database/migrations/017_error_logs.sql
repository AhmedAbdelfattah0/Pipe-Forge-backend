-- 017_error_logs.sql
-- Captures every failed API request: full payload, error details, and the message shown to the user.

CREATE TABLE error_logs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email        text,

  endpoint          text NOT NULL,
  http_method       text DEFAULT 'POST',
  request_payload   jsonb,

  error_type        text NOT NULL,
  error_message     text NOT NULL,
  stack_trace       text,

  http_status       integer,
  user_facing_error text,

  platform          text,
  deploy_target     text,
  node_version      text,
  markets_count     integer,

  resolved          boolean DEFAULT false,
  resolved_at       timestamptz,
  resolved_note     text,

  created_at        timestamptz DEFAULT now()
);

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin read" ON error_logs FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "service insert" ON error_logs FOR INSERT
  WITH CHECK (true);
