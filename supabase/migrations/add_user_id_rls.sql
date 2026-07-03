-- ============================================================================
-- Migration: Add user_id + RLS policies for registrations, teams, and players
-- Run this in the Supabase SQL Editor.
-- ============================================================================

-- 1. Add user_id columns referencing auth.users
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE teams         ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Enable RLS on all three tables (idempotent)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams         ENABLE ROW LEVEL SECURITY;
ALTER TABLE players       ENABLE ROW LEVEL SECURITY;

-- 3. SECURITY DEFINER helper – lets admin checks work without RLS recursion
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

-- ============================================================================
-- REGISTRATIONS
-- ============================================================================
DROP POLICY IF EXISTS "Users can insert own registrations" ON registrations;
CREATE POLICY "Users can insert own registrations"
  ON registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own registrations" ON registrations;
CREATE POLICY "Users can view own registrations"
  ON registrations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own registrations" ON registrations;
CREATE POLICY "Users can update own registrations"
  ON registrations FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all registrations" ON registrations;
CREATE POLICY "Admins can view all registrations"
  ON registrations FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update registrations" ON registrations;
CREATE POLICY "Admins can update registrations"
  ON registrations FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete registrations" ON registrations;
CREATE POLICY "Admins can delete registrations"
  ON registrations FOR DELETE
  USING (public.is_admin());

-- ============================================================================
-- TEAMS
-- ============================================================================
DROP POLICY IF EXISTS "Users can insert own teams" ON teams;
CREATE POLICY "Users can insert own teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own teams" ON teams;
CREATE POLICY "Users can view own teams"
  ON teams FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all teams" ON teams;
CREATE POLICY "Admins can view all teams"
  ON teams FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update teams" ON teams;
CREATE POLICY "Admins can update teams"
  ON teams FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete teams" ON teams;
CREATE POLICY "Admins can delete teams"
  ON teams FOR DELETE
  USING (public.is_admin());

-- ============================================================================
-- PLAYERS  (protected through the team relationship)
-- ============================================================================
DROP POLICY IF EXISTS "Users can insert players for own teams" ON players;
CREATE POLICY "Users can insert players for own teams"
  ON players FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = players.team_id
        AND teams.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view players for own teams" ON players;
CREATE POLICY "Users can view players for own teams"
  ON players FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = players.team_id
        AND teams.user_id = auth.uid()
    )
  );

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

-- ============================================================================
-- STORAGE  (payment-screenshots bucket – private, user-scoped folders)
-- ============================================================================
-- Ensure the bucket is private
UPDATE storage.buckets
SET public = false
WHERE id = 'payment-screenshots';

DROP POLICY IF EXISTS "Authenticated users can upload payment screenshots" ON storage.objects;
CREATE POLICY "Authenticated users can upload payment screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'payment-screenshots'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can view own payment screenshots" ON storage.objects;
CREATE POLICY "Users can view own payment screenshots"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'payment-screenshots'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Admins can view all payment screenshots" ON storage.objects;
CREATE POLICY "Admins can view all payment screenshots"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'payment-screenshots'
    AND public.is_admin()
  );
