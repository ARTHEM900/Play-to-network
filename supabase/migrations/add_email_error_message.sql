-- ============================================================================
-- Migration: Add email_error_message column to registrations
-- Run this in the Supabase SQL Editor.
-- ============================================================================

ALTER TABLE registrations ADD COLUMN IF NOT EXISTS email_error_message TEXT;
