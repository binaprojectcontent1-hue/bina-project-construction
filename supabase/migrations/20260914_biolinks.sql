-- ==============================================================================
-- BINA PROJECT SUPABASE MIGRATION: BIO LINK TABLES
-- Migration Date: 2026-09-14
-- Description: Creates biolinks and biolink_settings tables for bio.binaproject.com
-- ==============================================================================

-- 1. Bio Links — individual link entries
CREATE TABLE IF NOT EXISTS public.biolinks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'globe',
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    click_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.biolinks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "biolinks_public_read" ON public.biolinks;
DROP POLICY IF EXISTS "biolinks_auth_manage" ON public.biolinks;

-- Public read access (for the bio link public page)
CREATE POLICY "biolinks_public_read" ON public.biolinks
    FOR SELECT USING (true);

-- Authenticated users can manage (for admin dashboard)
CREATE POLICY "biolinks_auth_manage" ON public.biolinks
    FOR ALL USING (auth.role() = 'authenticated');

-- 2. Bio Link Settings — profile info (single row)
CREATE TABLE IF NOT EXISTS public.biolink_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_name VARCHAR(100) DEFAULT 'Bina Project',
    tagline TEXT DEFAULT 'Jasa Konstruksi & Interior Terpercaya di Malang',
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.biolink_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "biolink_settings_public_read" ON public.biolink_settings;
DROP POLICY IF EXISTS "biolink_settings_auth_manage" ON public.biolink_settings;

CREATE POLICY "biolink_settings_public_read" ON public.biolink_settings
    FOR SELECT USING (true);

CREATE POLICY "biolink_settings_auth_manage" ON public.biolink_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings row if table is empty
INSERT INTO public.biolink_settings (profile_name, tagline)
SELECT 'Bina Project', 'Jasa Konstruksi & Interior Terpercaya di Malang'
WHERE NOT EXISTS (SELECT 1 FROM public.biolink_settings);

-- Insert starter seed links if table is empty
INSERT INTO public.biolinks (title, url, icon, is_active, sort_order)
SELECT title, url, icon, is_active, sort_order FROM (
    VALUES 
    ('Konsultasi Gratis via WhatsApp', 'https://wa.me/6281335335304?text=Halo%20Bina%20Project,%20saya%20ingin%20konsultasi%20proyek', 'message-circle', true, 1),
    ('Kunjungi Website Resmi Bina Project', 'https://binaproject.com', 'globe', true, 2),
    ('Lihat Portofolio Proyek & Desain', 'https://binaproject.com/portfolio', 'briefcase', true, 3),
    ('Hitung Estimasi Biaya Bangun / Renovasi', 'https://binaproject.com/kontak', 'calculator', true, 4),
    ('Baca Artikel & Tips Konstruksi', 'https://binaproject.com/blog', 'book-open', true, 5)
) AS seeds(title, url, icon, is_active, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.biolinks);

-- 3. RPC function to increment click count atomically
CREATE OR REPLACE FUNCTION public.increment_biolink_click(link_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.biolinks
    SET click_count = click_count + 1,
        updated_at = now()
    WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
