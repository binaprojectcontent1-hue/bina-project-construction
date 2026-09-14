-- ==============================================================================
-- Migration: Add Before & After Transformation Slider Fields to Projects
-- Date: 2026-09-14
-- ==============================================================================

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS enable_before_after BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS before_image TEXT,
ADD COLUMN IF NOT EXISTS after_image TEXT,
ADD COLUMN IF NOT EXISTS renovation_duration VARCHAR(100),
ADD COLUMN IF NOT EXISTS transformation_scope VARCHAR(255);

COMMENT ON COLUMN public.projects.enable_before_after IS 'Toggle whether to display interactive Before-After comparison slider on this project';
COMMENT ON COLUMN public.projects.before_image IS 'URL / storage path for original pre-renovation photo';
COMMENT ON COLUMN public.projects.after_image IS 'URL / storage path for completed renovation photo (fallback to cover_image if null)';
COMMENT ON COLUMN public.projects.renovation_duration IS 'Project renovation duration (e.g. 60 Hari Kalender)';
COMMENT ON COLUMN public.projects.transformation_scope IS 'Scope of renovation work (e.g. Fasad Eksterior & Pagar)';
