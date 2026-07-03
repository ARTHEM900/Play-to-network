-- ============================================================================
-- Migration: Add user_id to players + switch to direct RLS policy
-- Run AFTER add_user_id_rls.sql in the Supabase SQL Editor.
-- Only adds the column if it does not already exist.
-- ============================================================================

-- 0. Ensure the helper function exists (idempotent)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 1. Add user_id to players (idempotent)
ALTER TABLE players ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Drop the subquery-based policies and replace with direct user_id check
DROP POLICY IF EXISTS "Users can insert players for own teams" ON players;
CREATE POLICY "Users can insert own players"
  ON players FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view players for own teams" ON players;
CREATE POLICY "Users can view own players"
  ON players FOR SELECT
  USING (auth.uid() = user_id);

-- Admin policies – re-create for safety
DROP POLICY IF EXISTS "Admins can view all players" ON players;
CREATE POLICY "Admins can view all players"
  ON players FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update players" ON players;
CREATE POLICY "Admins can update players"
  ON players FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete players" ON players;
CREATE POLICY "Admins can delete players"
  ON players FOR DELETE
  USING (public.is_admin());
