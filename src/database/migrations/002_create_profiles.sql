-- =============================================================================
-- Migration 002: profiles table
-- =============================================================================
-- One profile row per authenticated user.
-- The profile id IS the user id — no separate user_id column.
-- A row is automatically created when a new user signs up via Supabase Auth.
-- RLS ensures users can only read and update their own profile row.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Table definition
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  -- Primary key is the same UUID as auth.users.id.
  -- Cascading delete removes the profile when the auth user is deleted.
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  display_name TEXT,
  avatar_url   TEXT,

  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read only their own profile.
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow authenticated users to update only their own profile.
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING      (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Trigger: keep updated_at current on every UPDATE
-- ---------------------------------------------------------------------------
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- ---------------------------------------------------------------------------
-- Trigger: auto-create a profile row whenever a new auth.users row is inserted
-- ---------------------------------------------------------------------------
-- The trigger lives on auth.users (a Supabase-managed table). Supabase allows
-- triggers to be created on auth.users from the public schema as long as the
-- function is defined in public or a trusted schema.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
-- Explicitly set the search path so the function resolves table names safely.
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    -- Use raw_user_meta_data->>'display_name' if provided at signup; otherwise NULL.
    NEW.raw_user_meta_data ->> 'display_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Drop the trigger first in case this migration is re-run.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
