-- Migration: Add thumbnail_url to job_postings table
-- Created: 2026-09-27

ALTER TABLE public.job_postings
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

COMMENT ON COLUMN public.job_postings.thumbnail_url IS 'Custom banner or thumbnail image URL for job card and social preview';
