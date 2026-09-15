-- Migration: 20260914_add_desain_category.sql
-- Description: Add sample projects with 'Desain' category and update existing categories

-- Add new Desain category projects
INSERT INTO public.live_projects (title, area_name, category, stage, progress, lat, lng, image_url, is_active)
VALUES
  (
    'Konsep Arsitektur Villa Tropis Modern',
    'Kedungkandang, Kota Malang',
    'Desain',
    'Penyusunan Gambar Arsitektur & 3D Visualisasi',
    75,
    -7.9820,
    112.6250,
    'https://images.unsplash.com/photo-1600607686527-6f88c0a5dc1d?q=80&w=800&auto=format&fit=crop',
    true
  ),
  (
    'Masterplan Kawasan Perumahan Eco-Green',
    'Singosari, Kabupaten Malang',
    'Desain',
    'Perencanaan Masterplan & Siteplan Detail',
    60,
    -7.9150,
    112.7350,
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
    true
  ),
  (
    'Rancang Bangun Interior Coffee Shop Industrial',
    'Lowokwaru, Kota Malang',
    'Interior',
    'Detailing Design Interior & Furniture Layout',
    85,
    -7.9650,
    112.6420,
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop',
    true
  )
ON CONFLICT DO NOTHING;

-- Update existing projects if needed (example: change some Renovasi to interior)
-- Uncomment if you want to migrate old data
/*
UPDATE public.live_projects 
SET category = 'Interior' 
WHERE category = 'Renovasi' AND area_name LIKE '%Klojen%';

-- Mark some projects as inactive for demonstration
UPDATE public.live_projects 
SET is_active = false 
WHERE title = 'Sample Inactive Project';
*/

-- Add comments
COMMENT ON TABLE public.live_projects IS 'Track on-going construction, renovation, interior, and design projects across East Java';
COMMENT ON COLUMN public.live_projects.category IS 'Project category: Konstruksi, Interior, or Desain';
