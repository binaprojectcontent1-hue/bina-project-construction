-- Migration: 20260914_live_projects.sql
-- Description: Create live_projects table for on-going project tracking

create table if not exists public.live_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  area_name text not null,
  category text not null default 'Konstruksi',
  stage text not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  lat double precision not null,
  lng double precision not null,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for public active project query performance
create index if not exists idx_live_projects_active on public.live_projects(is_active) where is_active = true;

-- Enable Row Level Security
alter table public.live_projects enable row level security;

-- Policy: Public read access for active projects
drop policy if exists "Public can view active live projects" on public.live_projects;
create policy "Public can view active live projects"
  on public.live_projects
  for select
  using (is_active = true);

-- Policy: Authenticated admin full CRUD
drop policy if exists "Authenticated users have full access to live projects" on public.live_projects;
create policy "Authenticated users have full access to live projects"
  on public.live_projects
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Starter Sample Data (Malang Raya, Batu, Surabaya, Pasuruan)
insert into public.live_projects (title, area_name, category, stage, progress, lat, lng, image_url, is_active)
values
  (
    'Pembangunan Rumah Tinggal Modern 2 Lantai',
    'Araya, Kota Malang',
    'Konstruksi',
    'Pengecoran Plat Lantai 2 & Struktur Kolom',
    65,
    -7.9350,
    112.6580,
    'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=800&auto=format&fit=crop',
    true
  ),
  (
    'Renovasi Total Fasad & Interior Villa',
    'Bumiaji, Kota Batu',
    'Renovasi',
    'Pemasangan Finishing Plafon & Rangka Atap',
    80,
    -7.8500,
    112.5350,
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    true
  ),
  (
    'Fabrikasi & Instalasi Kitchen Set Minimalis',
    'Klojen, Kota Malang',
    'Interior',
    'Finishing Duco & Fitting Hardware Slow-Motion',
    90,
    -7.9780,
    112.6300,
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop',
    true
  ),
  (
    'Pembangunan Ruko & Kantor Bisnis 3 Lantai',
    'Warugunung, Surabaya Barat',
    'Konstruksi',
    'Pekerjaan Struktur Bawah & Pondasi Footplate',
    35,
    -7.3400,
    112.6900,
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    true
  )
on conflict do nothing;
