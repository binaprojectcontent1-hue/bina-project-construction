-- ==============================================================================
-- BINA PROJECT RECRUITMENT SYSTEM - DATABASE MIGRATION
-- Portal Karir (karir.binaproject.id) & ATS Module
-- Created: 2026-09-20
-- ==============================================================================

-- 1. Create Job Postings Table
CREATE TABLE IF NOT EXISTS public.job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL DEFAULT 'Konstruksi & Lapangan',
    job_type VARCHAR(50) NOT NULL DEFAULT 'Full-time',
    workplace_type VARCHAR(50) NOT NULL DEFAULT 'On-site',
    location VARCHAR(255) NOT NULL DEFAULT 'Malang, Jawa Timur',
    experience_level VARCHAR(50) NOT NULL DEFAULT '1-3 Tahun',
    salary_range VARCHAR(100),
    show_salary BOOLEAN DEFAULT false,
    description TEXT NOT NULL,
    responsibilities TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    -- Dynamic questionnaire per position (JSONB)
    -- Example: [{"id":"q1","question":"Apakah menguasai SketchUp & Enscape?","type":"radio","options":["Ya","Tidak"],"knockout_value":"Tidak","required":true}]
    custom_questions JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'published',
    application_deadline DATE,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_postings_status ON public.job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_department ON public.job_postings(department);
CREATE INDEX IF NOT EXISTS idx_job_postings_slug ON public.job_postings(slug);

-- 2. Create Job Applications Table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.job_postings(id) ON DELETE SET NULL,
    job_title VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    last_experience TEXT,
    expected_salary VARCHAR(100),
    join_availability VARCHAR(100) NOT NULL DEFAULT 'Segera',
    resume_path TEXT NOT NULL,
    portfolio_url TEXT,
    custom_answers JSONB DEFAULT '{}'::jsonb,
    is_talent_pool BOOLEAN DEFAULT false,
    screening_status VARCHAR(50) NOT NULL DEFAULT 'review',
    pipeline_stage VARCHAR(50) NOT NULL DEFAULT 'new',
    hr_notes TEXT,
    rating INT DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_pipeline_stage ON public.job_applications(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_job_applications_screening_status ON public.job_applications(screening_status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON public.job_applications(created_at DESC);

-- 3. RLS Policies for job_postings
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Published Jobs" ON public.job_postings;
CREATE POLICY "Public Read Published Jobs"
    ON public.job_postings FOR SELECT
    USING (status = 'published');

DROP POLICY IF EXISTS "Admin Manage Jobs" ON public.job_postings;
CREATE POLICY "Admin Manage Jobs"
    ON public.job_postings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. RLS Policies for job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Insert Applications" ON public.job_applications;
CREATE POLICY "Public Insert Applications"
    ON public.job_applications FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Read Applications" ON public.job_applications;
CREATE POLICY "Admin Read Applications"
    ON public.job_applications FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Admin Update Applications" ON public.job_applications;
CREATE POLICY "Admin Update Applications"
    ON public.job_applications FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Delete Applications" ON public.job_applications;
CREATE POLICY "Admin Delete Applications"
    ON public.job_applications FOR DELETE
    TO authenticated
    USING (true);

-- 5. Updated_at triggers
CREATE TRIGGER set_updated_at_job_postings
    BEFORE UPDATE ON public.job_postings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at_job_applications
    BEFORE UPDATE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Private Storage Bucket for Resumes & Documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-applications', 'job-applications', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage Policies
DROP POLICY IF EXISTS "Public Upload Resumes" ON storage.objects;
CREATE POLICY "Public Upload Resumes"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'job-applications');

DROP POLICY IF EXISTS "Admin Read Resumes" ON storage.objects;
CREATE POLICY "Admin Read Resumes"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'job-applications');

DROP POLICY IF EXISTS "Admin Manage Resumes" ON storage.objects;
CREATE POLICY "Admin Manage Resumes"
    ON storage.objects FOR ALL
    TO authenticated
    USING (bucket_id = 'job-applications');
