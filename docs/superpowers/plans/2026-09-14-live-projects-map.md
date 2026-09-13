# Live Projects Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Transform the static "Wilayah Layanan" map into an interactive "Peta Proyek Berjalan" (Live Projects Map) showing real-time on-going project locations and progress percentages across East Java, and build an intuitive management module in the Admin Dashboard for non-programmers.

**Architecture:** 
1. Supabase database table `live_projects` with Row-Level Security (RLS) allowing public read for active projects and full CRUD for authenticated dashboard admins.
2. An interactive Leaflet map component on the main website (`LiveProjectsMap.tsx`) featuring clean architectural pins (minimalist SVG, brand colors, no pulsating distraction), privacy-preserving cards (showing general area, stage, and progress bar without numerical lat/long coordinates or private client addresses), with automatic local fallback when offline.
3. A dedicated "Proyek Berjalan" management module in the admin dashboard (`LiveProjectsManager.tsx` and `LocationPickerMap.tsx`) providing an interactive mini-map pin dropper, preset city buttons, progress sliders, and active/archive toggles.

**Tech Stack:** Astro, React, TypeScript, Leaflet, TailwindCSS, Supabase, Zod, Lucide Icons.

**Spec:** `docs/superpowers/specs/2026-09-14-live-projects-map-design.md`

## Global Constraints
- **Zero Coordinate Leak:** Do not expose raw latitude and longitude decimal numbers in public UI cards or tooltips.
- **Privacy by Design:** Project locations must use general area names (e.g., "Klojen, Malang" or "Bumiaji, Batu") without specific street numbers or private homeowner names.
- **Pin Marker Aesthetics:** Use a clean, elegant architectural pin icon without pulsating/radar animations.
- **Lifecycle Filter:** Public map only queries and displays active projects (`is_active = true`). Completed/archived projects stay in the admin database.
- **Typecheck Quality Gate:** `npx astro check` and `npm run typecheck:dash` must pass with 0 errors.

---

### Task 1: Supabase Database Migration & Starter Seed Data

**Files:**
- Create: `supabase/migrations/20260914_live_projects.sql`

**Interfaces:**
- Produces: `public.live_projects` table schema, indexes, RLS policies, and 4 starter rows.

- [x] **Step 1: Write the Supabase SQL migration file**

```sql
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
```

- [x] **Step 2: Commit the migration file**

```bash
git add supabase/migrations/20260914_live_projects.sql
git commit -m "feat(db): add live_projects table migration and starter seed data"
```

---

### Task 2: Shared Types & Fallback Data in Astro Site

**Files:**
- Create: `src/types/liveProject.ts`
- Create: `src/data/liveProjects.ts`

**Interfaces:**
- Produces: `LiveProject` TypeScript interface and `FALLBACK_LIVE_PROJECTS` array.

- [x] **Step 1: Create `src/types/liveProject.ts`**

```typescript
export interface LiveProject {
  id: string;
  title: string;
  area_name: string;
  category: 'Konstruksi' | 'Renovasi' | 'Interior' | 'Arsitektur';
  stage: string;
  progress: number;
  lat: number;
  lng: number;
  image_url?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
```

- [x] **Step 2: Create `src/data/liveProjects.ts`**

```typescript
import type { LiveProject } from '../types/liveProject';

export const FALLBACK_LIVE_PROJECTS: LiveProject[] = [
  {
    id: 'sample-1',
    title: 'Pembangunan Rumah Tinggal Modern 2 Lantai',
    area_name: 'Araya, Kota Malang',
    category: 'Konstruksi',
    stage: 'Pengecoran Plat Lantai 2 & Struktur Kolom',
    progress: 65,
    lat: -7.9350,
    lng: 112.6580,
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
  {
    id: 'sample-2',
    title: 'Renovasi Total Fasad & Interior Villa',
    area_name: 'Bumiaji, Kota Batu',
    category: 'Renovasi',
    stage: 'Pemasangan Finishing Plafon & Rangka Atap',
    progress: 80,
    lat: -7.8500,
    lng: 112.5350,
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
  {
    id: 'sample-3',
    title: 'Fabrikasi & Instalasi Kitchen Set Minimalis',
    area_name: 'Klojen, Kota Malang',
    category: 'Interior',
    stage: 'Finishing Duco & Fitting Hardware Slow-Motion',
    progress: 90,
    lat: -7.9780,
    lng: 112.6300,
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
  {
    id: 'sample-4',
    title: 'Pembangunan Ruko & Kantor Bisnis 3 Lantai',
    area_name: 'Warugunung, Surabaya Barat',
    category: 'Konstruksi',
    stage: 'Pekerjaan Struktur Bawah & Pondasi Footplate',
    progress: 35,
    lat: -7.3400,
    lng: 112.6900,
    image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
];
```

- [x] **Step 3: Commit types and fallback data**

```bash
git add src/types/liveProject.ts src/data/liveProjects.ts
git commit -m "feat(data): add LiveProject types and fallback dataset"
```

---

### Task 3: Live Projects Map Component (`src/components/LiveProjectsMap.tsx`)

**Files:**
- Create: `src/components/LiveProjectsMap.tsx`

**Interfaces:**
- Consumes: `LiveProject` from `src/types/liveProject.ts`, `FALLBACK_LIVE_PROJECTS` from `src/data/liveProjects.ts`, `supabase` client from `@supabase/supabase-js`.
- Produces: `<LiveProjectsMap />` React component.

- [x] **Step 1: Write `src/components/LiveProjectsMap.tsx`**

Implement:
1. Leaflet map container centered on East Java (`[-7.95, 112.62]`, zoom 10).
2. Clean architectural SVG pin marker:
   - Compact teardrop pin with building/compass glyph.
   - Distinctive brand colors: `#E67E22` (primary brand amber) with crisp white border and drop shadow.
   - Zero pulsating radar animations.
3. Card popup:
   - Category badge (Konstruksi / Renovasi / Interior).
   - Project title (clean H4).
   - General area text (e.g., "Araya, Kota Malang").
   - Progress bar (0-100%) with percentage label and current stage of work.
   - Project thumbnail if available.
   - Direct WhatsApp consultation link for this specific project type.
4. Top status bar / HUD:
   - Badge "LIVE PROJECT TRACKER"
   - Counter: "X Proyek Aktif Sedang Dikerjakan"
   - Category filter pills (Semua, Konstruksi, Renovasi, Interior).
5. Supabase data fetch with graceful fallback to `FALLBACK_LIVE_PROJECTS`.

- [x] **Step 2: Verify component with `npx astro check`**

Run: `npx astro check`
Expected: 0 errors.

- [x] **Step 3: Commit map component**

```bash
git add src/components/LiveProjectsMap.tsx
git commit -m "feat(ui): create LiveProjectsMap component with architectural pins and progress cards"
```

---

### Task 4: Integrate Map & Update Navigation on Website

**Files:**
- Modify: `src/data/navigation.ts`
- Modify: `src/pages/about.astro`

**Interfaces:**
- Replaces `<CoverageMap />` with `<LiveProjectsMap client:visible />` in `about.astro`.
- Updates navigation link from "Wilayah Layanan" to "Proyek Berjalan".

- [x] **Step 1: Update `src/data/navigation.ts`**

Change line 12:
```typescript
{ name: 'Proyek Berjalan', href: '/about#proyek-berjalan', icon: 'solar:map-point-linear' },
```

- [x] **Step 2: Update `src/pages/about.astro`**

Replace the old Coverage section:
- Section ID: `#proyek-berjalan`
- SectionHeader:
  - `badge="Proyek Berjalan"`
  - `badgeIcon="solar:map-point-wave-bold"`
  - `title="Peta Progres Proyek Lapangan"`
  - `description="Pantau proyek konstruksi dan interior yang sedang dikerjakan oleh tim Bina Project secara real-time di berbagai lokasi."`
- Component: `<LiveProjectsMap client:visible />`

- [x] **Step 3: Run `npx astro check` to verify types and templates**

Run: `npx astro check`
Expected: 0 errors.

- [x] **Step 4: Commit website integration**

```bash
git add src/data/navigation.ts src/pages/about.astro
git commit -m "feat(pages): integrate LiveProjectsMap and update navigation to Proyek Berjalan"
```

---

### Task 5: Dashboard Dependencies & Schema

**Files:**
- Modify: `apps/dashboard/package.json`
- Create: `apps/dashboard/src/schemas/liveProjectSchema.ts`

**Interfaces:**
- Produces: `liveProjectFormSchema` and `LiveProjectFormData` in dashboard.

- [x] **Step 1: Install Leaflet in dashboard workspace**

Run:
```bash
npm --prefix apps/dashboard install leaflet @types/leaflet
```

- [x] **Step 2: Create `apps/dashboard/src/schemas/liveProjectSchema.ts`**

```typescript
import { z } from 'zod';

export const liveProjectFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Nama proyek minimal 5 karakter.')
    .max(120, 'Nama proyek maksimal 120 karakter.'),
  area_name: z
    .string()
    .trim()
    .min(3, 'Nama kawasan minimal 3 karakter (contoh: Araya, Kota Malang).')
    .max(100, 'Nama kawasan maksimal 100 karakter.'),
  category: z.enum(['Konstruksi', 'Renovasi', 'Interior', 'Arsitektur'], {
    errorMap: () => ({ message: 'Pilih kategori yang valid.' }),
  }),
  stage: z
    .string()
    .trim()
    .min(3, 'Tahap pengerjaan wajib diisi (contoh: Pengecoran Plat Lantai 2).')
    .max(100, 'Tahap pengerjaan maksimal 100 karakter.'),
  progress: z
    .number()
    .int()
    .min(0, 'Progres minimal 0%.')
    .max(100, 'Progres maksimal 100%.'),
  lat: z.number({ required_error: 'Pilih titik lokasi di peta.' }),
  lng: z.number({ required_error: 'Pilih titik lokasi di peta.' }),
  image_url: z.string().trim().url('URL gambar tidak valid.').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

export type LiveProjectFormData = z.infer<typeof liveProjectFormSchema>;
```

- [x] **Step 3: Run `npm run typecheck:dash` to verify schema**

Run: `npm run typecheck:dash`
Expected: 0 errors.

- [x] **Step 4: Commit dashboard schema and dependencies**

```bash
git add apps/dashboard/package.json apps/dashboard/package-lock.json apps/dashboard/src/schemas/liveProjectSchema.ts
git commit -m "feat(dash): install leaflet and create live project validation schema"
```

---

### Task 6: Dashboard Mini-Map Location Picker Component

**Files:**
- Create: `apps/dashboard/src/components/LocationPickerMap.tsx`

**Interfaces:**
- Consumes: `lat: number`, `lng: number`, `onChange: (lat: number, lng: number) => void`.
- Produces: `<LocationPickerMap />` React component.

- [x] **Step 1: Write `apps/dashboard/src/components/LocationPickerMap.tsx`**

Features:
1. Interactive Leaflet container inside modal.
2. Quick-jump buttons for non-programmers:
   - `[Kota Malang]` `[Kota Batu]` `[Kab. Malang]` `[Surabaya]` `[Sidoarjo]` `[Pasuruan]`
   - Clicking a button pans the map to that city and centers the pin.
3. Draggable marker: dragging the pin updates `onChange(newLat, newLng)`.
4. Clicking anywhere on the map moves the pin there.
5. Visual helper text: "Klik atau geser pin ke perkiraan area proyek. Koordinat tersimpan otomatis dan dirahasiakan dari publik." (Zero numerical coordinate confusion for non-programmers).

- [x] **Step 2: Verify with `npm run typecheck:dash`**

Run: `npm run typecheck:dash`
Expected: 0 errors.

- [x] **Step 3: Commit LocationPickerMap component**

```bash
git add apps/dashboard/src/components/LocationPickerMap.tsx
git commit -m "feat(dash): add interactive LocationPickerMap component for admin"
```

---

### Task 7: Dashboard Live Projects Manager Page

**Files:**
- Create: `apps/dashboard/src/pages/LiveProjectsManager.tsx`

**Interfaces:**
- Consumes: `supabase`, `LocationPickerMap`, `liveProjectFormSchema`.
- Produces: `<LiveProjectsManager />` page.

- [x] **Step 1: Write `apps/dashboard/src/pages/LiveProjectsManager.tsx`**

Features:
1. **Header & Quick Stats:**
   - Total Proyek Berjalan
   - Rata-rata Persentase Progres
   - Jumlah Proyek per Kategori (Konstruksi, Renovasi, Interior)
   - Tombol "+ Tambah Proyek Baru"
2. **Project List (Table & Card Views):**
   - Thumbnail foto pengerjaan
   - Judul proyek & nama kawasan umum
   - Badge kategori
   - Progress bar mini (%) + teks tahap pekerjaan
   - Toggle switch `is_active` (klik langsung untuk tampilkan/sembunyikan di peta website secara instan)
   - Tombol Edit & Hapus dengan dialog konfirmasi
3. **Modal Form Tambah / Edit:**
   - Field: Judul Proyek
   - Field: Kategori (Dropdown)
   - Field: Nama Kawasan Umum (input text, contoh: "Araya, Kota Malang")
   - Component: `<LocationPickerMap />`
   - Field: Tahap Pengerjaan saat ini
   - Field: Slider Progres (0% - 100%) dengan display angka besar
   - Field: URL Foto Dokumentasi Lapangan (opsional)
   - Field: Toggle "Tampilkan di Peta Website"
   - Integrasi Zod validation & feedback error yang jelas

- [x] **Step 2: Run `npm run typecheck:dash`**

Run: `npm run typecheck:dash`
Expected: 0 errors.

- [x] **Step 3: Commit LiveProjectsManager page**

```bash
git add apps/dashboard/src/pages/LiveProjectsManager.tsx
git commit -m "feat(dash): create LiveProjectsManager page with full CRUD and mini-map picker"
```

---

### Task 8: Dashboard Navigation & Route Wiring

**Files:**
- Modify: `apps/dashboard/src/components/Sidebar.tsx`
- Modify: `apps/dashboard/src/App.tsx`

**Interfaces:**
- Adds `'live-projects'` tab to `TabType`, sidebar navigation, and router rendering in `App.tsx`.

- [x] **Step 1: Update `apps/dashboard/src/components/Sidebar.tsx`**

1. Add `'live-projects'` to `TabType`:
```typescript
export type TabType =
  | 'overview'
  | 'portfolio'
  | 'articles'
  | 'live-projects'
  | 'biolink'
  | 'redirects'
  | 'settings'
  | 'portfolio-new'
  | 'article-new';
```
2. In the navigation items array in `Sidebar.tsx`, add the "Proyek Berjalan" entry with `MapPin` icon directly below Portofolio.

- [x] **Step 2: Update `apps/dashboard/src/App.tsx`**

1. Import `LiveProjectsManager` from `./pages/LiveProjectsManager`.
2. Add `'live-projects'` to `validTabs` array.
3. Update browser tab title map:
```typescript
'live-projects': 'Peta Proyek Berjalan - Bina Project Studio',
```
4. Render `<LiveProjectsManager />` when `activeTab === 'live-projects'`.

- [x] **Step 3: Run `npm run typecheck:dash` to verify all routes and types**

Run: `npm run typecheck:dash`
Expected: 0 errors.

- [x] **Step 4: Commit dashboard navigation integration**

```bash
git add apps/dashboard/src/components/Sidebar.tsx apps/dashboard/src/App.tsx
git commit -m "feat(dash): wire live-projects tab into dashboard sidebar and router"
```

---

### Task 9: End-to-End Verification & Quality Check

**Files:**
- Verify: Full website and dashboard build.

- [x] **Step 1: Run typechecks across all projects**

Run:
```bash
npx astro check
npm run typecheck:dash
```
Expected: Both pass with 0 errors.

- [x] **Step 2: Verify production build**

Run:
```bash
npm run build
npm run build:dash
```
Expected: Both builds succeed without error.

- [x] **Step 3: Visual & functional test using browser**

1. Open `/about#proyek-berjalan` in browser, verify map loads with architectural pins.
2. Click pins: check popup title, category badge, general area, progress bar, photo, and WhatsApp link.
3. Open dashboard at `http://localhost:5173/#live-projects`.
4. Test adding a new project with the mini map location picker, verify pin updates without coordinate leak.
5. Test toggling active/inactive switch.

- [x] **Step 4: Final commit & push to GitHub**

```bash
git commit -am "chore: complete live projects map feature implementation and verification"
git push origin main
```
