-- ==============================================================================
-- BINA PROJECT SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Konstruksi', -- 'Eksterior', 'Interior', 'Konstruksi', 'Kitchen Set'
    location VARCHAR(255) NOT NULL DEFAULT 'Malang, Jawa Timur',
    project_date VARCHAR(100) NOT NULL,
    client VARCHAR(255) DEFAULT 'Klien Bina Project',
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    -- Google SEO Fields & Publishing Status
    meta_title VARCHAR(70),
    meta_description VARCHAR(160),
    alt_cover_image TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'published', -- 'published' | 'draft'
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) DEFAULT 'Bina Project',
    publish_date VARCHAR(100) NOT NULL,
    category VARCHAR(100) DEFAULT 'Interior',
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    -- Google SEO Fields & Publishing Status
    meta_title VARCHAR(70),
    meta_description VARCHAR(160),
    focus_keyword VARCHAR(100),
    alt_cover_image TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'published', -- 'published' | 'draft'
    reading_time INT DEFAULT 3,
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Redirects Table (301 Redirect Protection when Slugs are Renamed in Admin)
CREATE TABLE IF NOT EXISTS public.redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_path VARCHAR(255) NOT NULL UNIQUE,
    target_path VARCHAR(255) NOT NULL,
    status_code INT NOT NULL DEFAULT 301,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Leads Table (Dual-Action Inbound Lead Capture & Attribution)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    service VARCHAR(100),
    message TEXT,
    source_url TEXT,
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'survey_scheduled', 'deal', 'lost'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies
-- Public (anon): READ-only access for website frontend
-- Authenticated (admin): Full CRUD access for dashboard

-- Projects
DROP POLICY IF EXISTS "Allow public read access on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated admin full access on projects" ON public.projects;
DROP POLICY IF EXISTS "Enable full access on projects" ON public.projects;
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
DROP POLICY IF EXISTS "Admin full access projects" ON public.projects;

CREATE POLICY "Public read projects"
    ON public.projects FOR SELECT
    USING (true);

CREATE POLICY "Admin full access projects"
    ON public.projects FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Articles
DROP POLICY IF EXISTS "Allow public read access on articles" ON public.articles;
DROP POLICY IF EXISTS "Allow authenticated admin full access on articles" ON public.articles;
DROP POLICY IF EXISTS "Enable full access on articles" ON public.articles;
DROP POLICY IF EXISTS "Public read articles" ON public.articles;
DROP POLICY IF EXISTS "Admin full access articles" ON public.articles;

CREATE POLICY "Public read articles"
    ON public.articles FOR SELECT
    USING (true);

CREATE POLICY "Admin full access articles"
    ON public.articles FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Redirects
DROP POLICY IF EXISTS "Allow public read access on redirects" ON public.redirects;
DROP POLICY IF EXISTS "Allow authenticated admin full access on redirects" ON public.redirects;
DROP POLICY IF EXISTS "Enable full access on redirects" ON public.redirects;
DROP POLICY IF EXISTS "Public read redirects" ON public.redirects;
DROP POLICY IF EXISTS "Admin full access redirects" ON public.redirects;

CREATE POLICY "Public read redirects"
    ON public.redirects FOR SELECT
    USING (true);

CREATE POLICY "Admin full access redirects"
    ON public.redirects FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Leads
DROP POLICY IF EXISTS "Allow public insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated admin full access leads" ON public.leads;
DROP POLICY IF EXISTS "Public insert leads" ON public.leads;
DROP POLICY IF EXISTS "Admin full access leads" ON public.leads;

-- Allow anonymous visitors to insert lead data from contact forms
CREATE POLICY "Public insert leads"
    ON public.leads FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow only authenticated admins to view/manage leads
CREATE POLICY "Admin full access leads"
    ON public.leads FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. Auto-update `updated_at` Trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_projects ON public.projects;
CREATE TRIGGER set_updated_at_projects
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_articles ON public.articles;
CREATE TRIGGER set_updated_at_articles
    BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_redirects ON public.redirects;
CREATE TRIGGER set_updated_at_redirects
    BEFORE UPDATE ON public.redirects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Supabase Storage Bucket Setup ('media')
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'media' bucket
DROP POLICY IF EXISTS "Public Read Media" ON storage.objects;
CREATE POLICY "Public Read Media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admin Upload Media" ON storage.objects;
CREATE POLICY "Admin Upload Media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Admin Update & Delete Media" ON storage.objects;
CREATE POLICY "Admin Update & Delete Media"
    ON storage.objects FOR ALL
    TO authenticated
    USING (bucket_id = 'media');
