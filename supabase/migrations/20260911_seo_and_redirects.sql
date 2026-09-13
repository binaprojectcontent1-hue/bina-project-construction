-- ==============================================================================
-- BINA PROJECT SUPABASE MIGRATION: SEO METADATA, REDIRECTS, & STATUS
-- Migration Date: 2026-09-11
-- Description: Adds Google-friendly SEO columns, slug redirect tracking, and publishing status
-- ==============================================================================

-- 1. Upgrade Projects Table with SEO Fields & Publishing Status
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70),
ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160),
ADD COLUMN IF NOT EXISTS alt_cover_image TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published',
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT now();

-- 2. Upgrade Articles Table with SEO Fields & Publishing Status
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70),
ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160),
ADD COLUMN IF NOT EXISTS focus_keyword VARCHAR(100),
ADD COLUMN IF NOT EXISTS alt_cover_image TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published',
ADD COLUMN IF NOT EXISTS reading_time INT DEFAULT 3,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT now();

-- 3. Create Redirects Table (Proteksi 301 Redirect saat Admin Mengubah Slug)
CREATE TABLE IF NOT EXISTS public.redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_path VARCHAR(255) NOT NULL UNIQUE, -- Contoh: /portfolio/slug-lama
    target_path VARCHAR(255) NOT NULL,        -- Contoh: /portfolio/slug-baru
    status_code INT NOT NULL DEFAULT 301,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable RLS on redirects
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

-- 5. Public Policy for Redirects (Read Only)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'redirects' AND policyname = 'Allow public read access on redirects'
    ) THEN
        CREATE POLICY "Allow public read access on redirects"
            ON public.redirects FOR SELECT
            USING (true);
    END IF;
END $$;

-- 6. Update Public Read Policies for Projects & Articles (Only 'published' visible to public)
DROP POLICY IF EXISTS "Allow public read access on projects" ON public.projects;
CREATE POLICY "Allow public read access on projects"
    ON public.projects FOR SELECT
    USING (status = 'published');

DROP POLICY IF EXISTS "Allow public read access on articles" ON public.articles;
CREATE POLICY "Allow public read access on articles"
    ON public.articles FOR SELECT
    USING (status = 'published');

-- 7. Admin CRUD Policies (Authenticated Users have full access)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'projects' AND policyname = 'Allow authenticated admin full access on projects'
    ) THEN
        CREATE POLICY "Allow authenticated admin full access on projects"
            ON public.projects FOR ALL
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'articles' AND policyname = 'Allow authenticated admin full access on articles'
    ) THEN
        CREATE POLICY "Allow authenticated admin full access on articles"
            ON public.articles FOR ALL
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'redirects' AND policyname = 'Allow authenticated admin full access on redirects'
    ) THEN
        CREATE POLICY "Allow authenticated admin full access on redirects"
            ON public.redirects FOR ALL
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;
