-- Migration: Add form_layout and unlisted status support
-- Created: 2026-09-27

-- 1. Add form_layout column to public.job_postings
ALTER TABLE public.job_postings
ADD COLUMN IF NOT EXISTS form_layout VARCHAR(30) DEFAULT 'multi_step';

COMMENT ON COLUMN public.job_postings.form_layout IS 'Layout style for application form: multi_step or single_page';

-- 2. Update Public Read RLS policy if needed so published AND unlisted jobs can be read
-- (Unlisted jobs can be viewed directly via their slug/link, but will be filtered out from public career listing)
DROP POLICY IF EXISTS "Public Read Published Jobs" ON public.job_postings;
CREATE POLICY "Public Read Published And Unlisted Jobs"
    ON public.job_postings FOR SELECT
    USING (status IN ('published', 'unlisted', 'closed'));
