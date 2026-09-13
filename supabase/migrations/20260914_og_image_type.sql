-- ==============================================================================
-- BINA PROJECT SUPABASE MIGRATION: OG IMAGE TYPE TOGGLE
-- Migration Date: 2026-09-14
-- Description: Adds og_image_type to projects and articles ('branded' | 'raw_cover')
-- ==============================================================================

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS og_image_type VARCHAR(20) DEFAULT 'branded';

ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS og_image_type VARCHAR(20) DEFAULT 'branded';
