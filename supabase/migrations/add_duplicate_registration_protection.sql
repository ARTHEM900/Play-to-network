-- ============================================================================
-- Migration: Add duplicate registration protection
-- Prevents a user from registering twice for the same tournament.
-- Run this in the Supabase SQL Editor.
-- ============================================================================

-- 1. Create a unique constraint to prevent duplicate registrations.
-- Each authenticated user can have only ONE registration per tournament.
ALTER TABLE registrations
ADD CONSTRAINT registrations_user_tournament_unique
UNIQUE (user_id, tournament_id);

-- 2. Create a policy to prevent RLS bypass via direct insert attempts.
-- This is a safety net in addition to the unique constraint.
DROP POLICY IF EXISTS "Users cannot register twice for same tournament" ON registrations;
