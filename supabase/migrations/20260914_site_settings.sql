-- ==============================================================================
-- BINA PROJECT SUPABASE MIGRATION: BUSINESS PROFILE & CONTACT SETTINGS
-- Migration Date: 2026-09-14
-- Description: Centralized business profile, contact channels, address, and social links
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'general',
    phone_display VARCHAR(50) DEFAULT '+62 81-335-335-304',
    phone_tel VARCHAR(50) DEFAULT 'tel:+6281335335304',
    whatsapp_number VARCHAR(50) DEFAULT '6281335335304',
    whatsapp_url TEXT DEFAULT 'https://wa.me/6281335335304',
    whatsapp_default_message TEXT DEFAULT 'Halo Bina Project, saya ingin konsultasi rencana proyek konstruksi/interior dan estimasi RAB gratis.',
    email VARCHAR(100) DEFAULT 'binaproject.info@gmail.com',
    address TEXT DEFAULT 'Jl. Watumujur II No.6, Kota Malang',
    city VARCHAR(100) DEFAULT 'Kota Malang',
    province VARCHAR(100) DEFAULT 'Jawa Timur',
    postal_code VARCHAR(20) DEFAULT '65145',
    google_maps_url TEXT DEFAULT 'https://maps.app.goo.gl/3E54uS2WDg4EPDgL6',
    google_maps_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.4746073810625!2d112.60884237591145!3d-7.94980687920362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7883eadea01223%3A0x3bf7f69bb74761e0!2sBina%20Project%20%7C%20Jasa%20Konstruksi%20dan%20Interior!5e0!3m2!1sid!2sid!4v1737646658910!5m2!1sid!2sid',
    opening_hours TEXT DEFAULT 'Senin - Sabtu: 08:00 - 16:00 WIB',
    opening_hours_detail TEXT DEFAULT 'Senin - Sabtu: 08:00 - 16:00 WIB | Minggu / Libur: Khusus Janji Temu',
    instagram_url TEXT DEFAULT 'https://www.instagram.com/binaproject.id',
    tiktok_url TEXT DEFAULT 'https://www.tiktok.com/@binaproject.id',
    youtube_url TEXT DEFAULT 'https://www.youtube.com/@binaproject.id',
    google_business_url TEXT DEFAULT 'https://share.google/bF9i03JuwxrcOQo7y',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "site_settings_public_read" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_auth_manage" ON public.site_settings;

-- Public read access (for Astro SSG build & public site)
CREATE POLICY "site_settings_public_read" ON public.site_settings
    FOR SELECT USING (true);

-- Authenticated users can manage (for Admin Dashboard)
CREATE POLICY "site_settings_auth_manage" ON public.site_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert starter seed if empty
INSERT INTO public.site_settings (id)
VALUES ('general')
ON CONFLICT (id) DO NOTHING;
