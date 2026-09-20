-- ==============================================================================
-- BINA PROJECT SUPABASE MIGRATION: DOMAIN MIGRATION TO BINAPROJECT.ID
-- Migration Date: 2026-09-20
-- Description: Migrates all stored media URLs, bio link targets, and content links
--              from binaproject.com to binaproject.id.
--              Fully guarded: Safely checks if each table exists before running
--              so it will NEVER fail even if optional tables are not yet created.
-- ==============================================================================

DO $do$
BEGIN
    -- 1. Projects Table (Portfolios)
    IF to_regclass('public.projects') IS NOT NULL THEN
        EXECUTE $sql$
            UPDATE public.projects
            SET
                cover_image = REPLACE(cover_image, 'https://binaproject.com/', 'https://binaproject.id/'),
                before_image = CASE WHEN before_image IS NOT NULL THEN REPLACE(before_image, 'https://binaproject.com/', 'https://binaproject.id/') ELSE before_image END,
                after_image = CASE WHEN after_image IS NOT NULL THEN REPLACE(after_image, 'https://binaproject.com/', 'https://binaproject.id/') ELSE after_image END,
                description = REPLACE(description, 'https://binaproject.com/', 'https://binaproject.id/'),
                updated_at = NOW()
            WHERE
                cover_image LIKE '%binaproject.com%'
                OR before_image LIKE '%binaproject.com%'
                OR after_image LIKE '%binaproject.com%'
                OR description LIKE '%binaproject.com%'
        $sql$;

        EXECUTE $sql$
            UPDATE public.projects
            SET
                gallery_images = ARRAY(
                    SELECT REPLACE(elem, 'https://binaproject.com/', 'https://binaproject.id/')
                    FROM unnest(gallery_images) AS elem
                ),
                updated_at = NOW()
            WHERE
                array_to_string(gallery_images, ',') LIKE '%binaproject.com%'
        $sql$;

        RAISE NOTICE '✓ Tabel public.projects berhasil dimigrasikan ke binaproject.id';
    ELSE
        RAISE NOTICE '- Tabel public.projects tidak ditemukan, dilewati.';
    END IF;

    -- 2. Articles Table (Blog / Tips)
    IF to_regclass('public.articles') IS NOT NULL THEN
        EXECUTE $sql$
            UPDATE public.articles
            SET
                cover_image = REPLACE(cover_image, 'https://binaproject.com/', 'https://binaproject.id/'),
                content = REPLACE(content, 'https://binaproject.com/', 'https://binaproject.id/'),
                excerpt = REPLACE(excerpt, 'https://binaproject.com/', 'https://binaproject.id/'),
                updated_at = NOW()
            WHERE
                cover_image LIKE '%binaproject.com%'
                OR content LIKE '%binaproject.com%'
                OR excerpt LIKE '%binaproject.com%'
        $sql$;

        RAISE NOTICE '✓ Tabel public.articles berhasil dimigrasikan ke binaproject.id';
    ELSE
        RAISE NOTICE '- Tabel public.articles tidak ditemukan, dilewati.';
    END IF;

    -- 3. Live Projects Table (On-going Projects Map / Tracking)
    IF to_regclass('public.live_projects') IS NOT NULL THEN
        EXECUTE $sql$
            UPDATE public.live_projects
            SET
                image_url = REPLACE(image_url, 'https://binaproject.com/', 'https://binaproject.id/'),
                updated_at = NOW()
            WHERE
                image_url LIKE '%binaproject.com%'
        $sql$;

        RAISE NOTICE '✓ Tabel public.live_projects berhasil dimigrasikan ke binaproject.id';
    ELSE
        RAISE NOTICE '- Tabel public.live_projects tidak ditemukan, dilewati.';
    END IF;

    -- 4. Bio Links Table (bio.binaproject.id)
    IF to_regclass('public.biolinks') IS NOT NULL THEN
        EXECUTE $sql$
            UPDATE public.biolinks
            SET
                url = REPLACE(url, 'https://binaproject.com', 'https://binaproject.id'),
                updated_at = NOW()
            WHERE
                url LIKE '%binaproject.com%'
        $sql$;

        RAISE NOTICE '✓ Tabel public.biolinks berhasil dimigrasikan ke binaproject.id';
    ELSE
        RAISE NOTICE '- Tabel public.biolinks tidak ditemukan, dilewati.';
    END IF;

    -- 5. Bio Link Settings Table
    IF to_regclass('public.biolink_settings') IS NOT NULL THEN
        EXECUTE $sql$
            UPDATE public.biolink_settings
            SET
                avatar_url = CASE WHEN avatar_url IS NOT NULL THEN REPLACE(avatar_url, 'https://binaproject.com/', 'https://binaproject.id/') ELSE avatar_url END,
                updated_at = NOW()
            WHERE
                avatar_url LIKE '%binaproject.com%'
        $sql$;

        RAISE NOTICE '✓ Tabel public.biolink_settings berhasil dimigrasikan ke binaproject.id';
    ELSE
        RAISE NOTICE '- Tabel public.biolink_settings tidak ditemukan, dilewati.';
    END IF;

    -- 6. Site Settings Table (Dynamic Contact & Social Profiles)
    IF to_regclass('public.site_settings') IS NOT NULL THEN
        EXECUTE $sql$
            UPDATE public.site_settings
            SET
                google_business_url = CASE WHEN google_business_url LIKE '%binaproject.com%' THEN REPLACE(google_business_url, 'binaproject.com', 'binaproject.id') ELSE google_business_url END,
                updated_at = NOW()
            WHERE
                id = 'general'
        $sql$;

        RAISE NOTICE '✓ Tabel public.site_settings berhasil dimigrasikan ke binaproject.id';
    ELSE
        RAISE NOTICE '- Tabel public.site_settings tidak ditemukan, dilewati.';
    END IF;

END $do$;

-- ==============================================================================
-- VERIFIKASI HASIL MIGRASI
-- ==============================================================================
DO $verify$
DECLARE
    cnt integer;
BEGIN
    IF to_regclass('public.projects') IS NOT NULL THEN
        EXECUTE 'SELECT count(*) FROM public.projects WHERE cover_image LIKE ''%binaproject.com%'' OR array_to_string(gallery_images, '','') LIKE ''%binaproject.com%''' INTO cnt;
        RAISE NOTICE '📊 Sisa URL lama di public.projects: %', cnt;
    END IF;

    IF to_regclass('public.articles') IS NOT NULL THEN
        EXECUTE 'SELECT count(*) FROM public.articles WHERE cover_image LIKE ''%binaproject.com%'' OR content LIKE ''%binaproject.com%''' INTO cnt;
        RAISE NOTICE '📊 Sisa URL lama di public.articles: %', cnt;
    END IF;

    IF to_regclass('public.live_projects') IS NOT NULL THEN
        EXECUTE 'SELECT count(*) FROM public.live_projects WHERE image_url LIKE ''%binaproject.com%''' INTO cnt;
        RAISE NOTICE '📊 Sisa URL lama di public.live_projects: %', cnt;
    END IF;

    IF to_regclass('public.biolinks') IS NOT NULL THEN
        EXECUTE 'SELECT count(*) FROM public.biolinks WHERE url LIKE ''%binaproject.com%''' INTO cnt;
        RAISE NOTICE '📊 Sisa URL lama di public.biolinks: %', cnt;
    END IF;
END $verify$;
