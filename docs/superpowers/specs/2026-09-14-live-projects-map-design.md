# Design Spec: Peta Visualisasi Proyek Berjalan (Live Projects Map)

**Tanggal:** 14 September 2026  
**Status:** Validated via Grill-Me & Ready for Review  
**Tujuan:** Mentransformasi seksi "Wilayah Layanan" menjadi "Peta Proyek Berjalan" interaktif yang menampilkan sebaran progres proyek riil yang sedang dikerjakan oleh Bina Project, serta menyediakan modul pengelolaan data yang ramah bagi non-programmer di Panel Admin Dashboard.

---

## 1. Latar Belakang & Motivasi
Sebelumnya, seksi "Wilayah Layanan" menggunakan peta statis yang menjelaskan kantor pusat dan persebaran cakupan kota. Kebutuhan aktual bisnis adalah memperlihatkan **bukti kerja nyata (social proof & real-time progress)**: calon klien ingin melihat langsung bahwa Bina Project sedang aktif mengerjakan proyek di berbagai titik lokasi dengan tahapan progres yang transparan.

Fitur ini harus:
1. Menampilkan peta interaktif yang bersih dan elegan (Leaflet-based) di website utama.
2. Melindungi privasi klien (tidak menampilkan alamat jalan detail, nomor rumah, maupun angka koordinat numerik).
3. Dapat dikelola dengan sangat mudah oleh tim non-programmer dari Panel Admin Dashboard (tambah, edit progres, upload foto dokumentasi, toggle aktif/arsip).

---

## 2. Arsitektur Data (Supabase)

### Tabel: `live_projects`
```sql
create table if not exists public.live_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,                       -- e.g. "Rumah Tinggal Modern Tropis 2 Lantai"
  area_name text not null,                   -- e.g. "Araya, Kota Malang" (kawasan umum tanpa detail privasi)
  category text not null default 'Konstruksi', -- "Konstruksi" | "Renovasi" | "Interior" | "Arsitektur"
  stage text not null,                       -- e.g. "Pengecoran Plat Lantai 2"
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  lat double precision not null,             -- Koordinat latitude untuk penempatan pin
  lng double precision not null,             -- Koordinat longitude untuk penempatan pin
  image_url text,                            -- Foto dokumentasi progres lapangan (opsional)
  is_active boolean not null default true,   -- Ditampilkan di peta publik atau tidak
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexing
create index idx_live_projects_active on public.live_projects(is_active) where is_active = true;

-- Row Level Security (RLS)
alter table public.live_projects enable row level security;

-- Public can read active projects only
create policy "Public can view active live projects"
  on public.live_projects
  for select
  using (is_active = true);

-- Authenticated users (Admin) have full access
create policy "Authenticated users have full access to live projects"
  on public.live_projects
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

---

## 3. Komponen Frontend Website (`binaproject`)

### 3.1 Navigasi & Halaman
- **Navbar & Mobile Menu (`src/data/navigation.ts`):**
  - Ganti label menu `'Wilayah Layanan'` menjadi `'Proyek Berjalan'` (arah tautan: `/about#proyek-berjalan`).
- **Halaman About (`src/pages/about.astro`):**
  - Ubah id section dari `#coverage-sec` menjadi `#proyek-berjalan`.
  - Update `SectionHeader`:
    - `badge`: "Proyek Berjalan"
    - `badgeIcon`: "solar:map-point-wave-bold"
    - `title`: "Peta Progres Proyek Lapangan"
    - `description`: "Pantau proyek konstruksi dan interior yang sedang dikerjakan oleh tim Bina Project secara real-time di berbagai lokasi."

### 3.2 Komponen Peta (`src/components/LiveProjectsMap.tsx`)
- Komponen React interaktif berbasis Leaflet dengan visual elegan:
  - **Tile Layer:** CartoDB Voyager / Positron dengan sentuhan minimalis arsitektural.
  - **Pin Marker:** Pin minimalis elegan (tanpa animasi denyut yang berlebihan), menggunakan warna brand aksen Bina Project.
  - **Interactive Pin Popup:**
    - Nama Proyek (H4 tebal & bersih).
    - Badge Kategori (Konstruksi / Renovasi / Interior).
    - Kawasan Umum (misal: "Klojen, Malang" — privasi klien terjaga).
    - Visual Progress Bar (0-100%) dengan teks tahapan pekerjaan saat ini (misal: "Pondasi & Struktur • 45%").
    - Thumbnail foto progres pengerjaan terkini (jika ada).
    - Tombol WhatsApp Konsultasi kontekstual (misal: "Konsultasi Proyek Serupa").
  - **Data Fetching:** Fetch langsung dari Supabase `live_projects` (status `is_active = true`). Jika Supabase belum terhubung / offline, otomatis fallback ke data lokal static yang tersimpan di `src/data/liveProjects.ts`.

---

## 4. Modul Panel Admin Dashboard (`apps/dashboard`)

### 4.1 Navigasi Dashboard
- Tambahkan menu baru di sidebar dashboard: **"Proyek Berjalan"** (`/live-projects` atau tab `live-projects`), dengan ikon peta/pin (`MapPin` atau `Layers`).

### 4.2 Halaman & Form Pengelolaan (`apps/dashboard/src/pages/LiveProjectsManager.tsx`)
- **Tampilan Daftar (List View):**
  - Ringkasan statistik (Total Proyek Aktif, Rata-rata Progres, Proyek per Kategori).
  - Tabel/Grid kartu proyek yang menampilkan judul, kawasan, kategori, progress bar %, status aktif (toggle on/off langsung), serta tombol Edit dan Hapus.
- **Form Modal Tambah & Edit (UX Non-Programmer):**
  - **Nama Proyek:** Input teks (misal: "Villa Modern 2 Lantai").
  - **Kategori:** Dropdown (Konstruksi Bangun Baru, Renovasi Rumah, Desain Interior & Kitchen Set).
  - **Kawasan Umum:** Dropdown preset area cepat (Kota Malang, Kota Batu, Kab. Malang, Surabaya, Pasuruan) + input teks custom kawasan (misal: "Araya", "Dieng", "Bumiaji").
  - **Picker Lokasi Interaktif:**
    - Mini Map interaktif Leaflet di dalam modal.
    - Mengklik atau menggeser pin di mini map otomatis mengisi titik koordinat secara transparan di balik layar (tidak memusingkan admin dengan angka desimal).
  - **Tahap Pekerjaan & Progres:**
    - Input teks tahapan (misal: "Pekerjaan Struktur & Dinding Bata").
    - Slider / input persentase (0% s/d 100%).
  - **Foto Dokumentasi:** Input URL foto atau file upload media.
  - **Status Publikasi:** Toggle Switch ("Tampilkan di Peta Website").

---

## 5. Keamanan & Privasi
- **Zero Coordinate Leak:** API publik dan komponen peta publik tidak menampilkan angka latitude/longitude di elemen teks manapun.
- **Privacy by Design:** Field alamat hanya berupa nama kawasan/area umum (misal: "Lowokwaru, Malang"), tidak ada nomor rumah atau identitas pemilik rumah.
- **Row Level Security (RLS):** Tamu publik hanya dapat melakukan `SELECT` pada data yang bernilai `is_active = true`. Operasi `INSERT`, `UPDATE`, `DELETE` diproteksi khusus pengguna terotentikasi di dashboard.

---

## 6. Rencana Verifikasi & Uji Kualitas
1. **Verifikasi Database:** Jalankan migrasi di Supabase, verifikasi RLS dan data starter 4 proyek.
2. **Verifikasi Admin Panel:** Uji alur tambah proyek baru dengan mini map picker, update progres %, toggle aktif/arsip, dan hapus proyek.
3. **Verifikasi Tampilan Website:** Pastikan peta memuat titik proyek aktif, popup menampilkan nama, kategori, kawasan, foto dokumentasi, dan progress bar secara presisi.
4. **Verifikasi Mobile & Responsif:** Uji interaksi peta dan popup pada layar smartphone dan desktop.
5. **Typecheck & Build:** Jalankan `npx astro check` dan `npm run build` untuk memastikan tidak ada regresi kode.
