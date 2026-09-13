# 🛡️ Master Blueprint: Prompt Audit Lengkap Seluruh Codebase (Full-Stack Codebase Audit)
> Dokumen ini berisi kumpulan prompt komprehensif untuk mengaudit seluruh codebase Bina Project secara menyeluruh — mencakup arsitektur Astro, Dashboard Admin, integrasi Supabase, penyimpanan media GitHub, keamanan, performa Core Web Vitals, hingga SEO produksi.

---

## ⚡ Master Prompt: Audit Full Codebase Sekaligus (All-In-One Master Audit)

Salin prompt di bawah ini untuk melakukan pemindaian komprehensif menyeluruh ke seluruh codebase dalam satu sesi:

```markdown
Bertindaklah sebagai Principal Full-Stack Software Architect, Security Auditor, dan Lead Performance Engineer.

Lakukan AUDIT KOMPREHENSIF MENYELURUH (Full Codebase Health, Architecture & Security Audit) pada seluruh proyek Bina Project ini, yang terdiri dari:
1. **Frontend Website**: Astro SSG (`/src`, `/public`, `astro.config.mjs`)
2. **Dashboard Admin**: React + Vite + TypeScript (`/apps/dashboard`)
3. **Database & Backend**: Supabase PostgreSQL (`/supabase/schema.sql`, `src/lib/supabase.ts`)
4. **Media Storage (Skema A)**: Dedicated GitHub Storage (`binaprojectcontent1-hue/bina-media`) + jsDelivr CDN + Cloudflare Pages Function Proxy (`functions/media/[[path]].ts`, `public/_redirects`)

---

### 🔍 7 PILAR PARAMETER AUDIT:

#### 1. 🏗️ Arsitektur & Build Health (Type Safety & Build Integrity)
- Jalankan pemeriksaan integritas TypeScript (`tsc --noEmit`) pada Astro dan Dashboard.
- Deteksi file orphan, unused imports, dependency usang, circular dependencies, atau konfigurasi build yang berpotensi gagal saat di-deploy ke production (Cloudflare Pages).
- Validasi apakah konfigurasi routing statis vs SSR berjalan harmonis tanpa konflik di `astro.config.mjs` dan `vite.config.ts`.

#### 2. 🗄️ Supabase Database & Data Integrity
- Periksa kesesuaian antara tipe TypeScript (`src/types/database.ts`, `apps/dashboard/src/types/database.ts`) dengan skema SQL aktual (`supabase/schema.sql`).
- Audit Row Level Security (RLS) policies: Apakah tabel `projects`, `articles`, dan `redirects` aman dari eksploitasi data publik namun tetap bisa diakses CRUD oleh admin?
- Verifikasi penanganan state kosong, error handling saat koneksi Supabase offline/gagal, dan fallback data service (`portfolioService.ts`, `blogService.ts`).

#### 3. 🖼️ Media Pipeline & CDN Proxy (GitHub Storage Skema A)
- Audit fungsi `getMediaUrl()` di `src/lib/cdn.ts` dan `apps/dashboard/src/lib/media.ts`:
  - Apakah URL lokal (`assets/img/...`) tidak salah diproxy ke GitHub?
  - Apakah URL media (`media/...`, `portfolio/...`, `articles/...`) berhasil dialihkan ke jsDelivr di dev dan Cloudflare Edge proxy di production?
- Periksa Cloudflare Pages Function (`functions/media/[[path]].ts`) dan `public/_redirects`: Apakah response headers sudah memasukkan `Cache-Control: public, max-age=31536000, immutable` dan `X-Robots-Tag: all` untuk SEO Google Images?

#### 4. 🎛️ Dashboard Admin (`apps/dashboard`)
- Audit alur CRUD dan form editor (`PortfolioEditor.tsx`, `ArticleEditor.tsx`, `RedirectsList.tsx`):
  - Validasi form, handling slug duplikat, dan pencatatan otomatis 301 redirects saat slug diubah.
  - Pemeriksaan `ImageUploader` dan `GalleryUploader`: Error handling saat token GitHub invalid, progress upload, dan format URL tersimpan.
  - Status keamanan token GitHub & Supabase keys di local storage vs environment variables.

#### 5. ⚡ Performa & Core Web Vitals (LCP, CLS, INP, Script Hydration)
- Audit pemuatan aset pihak ketiga di `BaseLayout.astro` (jQuery, Swiper, Isotope, Magnific Popup, GSAP, Leaflet). Apakah sudah optimal atau membebani Total Blocking Time (TBT)?
- Periksa pemuatan gambar: Apakah gambar Hero / LCP menggunakan `loading="eager"` + `fetchpriority="high"`, sementara gambar di bawah fold menggunakan `loading="lazy"` dengan dimensi eksplisit (`width` & `height`) untuk mencegah layout shift (CLS 0)?

#### 6. 🌐 Google SEO & Rich Snippets (Schema.org)
- Periksa kelengkapan canonical URL, trailing slashes, dan meta tags robots (`max-image-preview:large`, `max-snippet:-1`).
- Validasi Schema.org JSON-LD di seluruh template (`BaseLayout.astro`, `portfolio/[slug].astro`, `blog/[slug].astro`): Apakah skema `WebSite`, `HomeAndConstructionBusiness`, `CreativeWork`, dan `BreadcrumbList` valid menurut Google Rich Results Test?

#### 7. 🔒 Keamanan & Kebocoran Rahasia (Secrets Leakage)
- Pindai seluruh codebase untuk mendeteksi apakah ada API Key rahasia (GitHub Personal Access Token, Supabase Service Role Key) yang bocor atau ter-commit ke git publik.
- Pastikan file `.env` dan `.legacy_backup` sudah masuk ke `.gitignore`.

---

### 📋 FORMAT LAPORAN HASIL AUDIT:
1. **Executive Summary**: Skor kesehatan codebase (1-100) dan ringkasan kondisi proyek.
2. **Matrix Temuan Masalah**:
   | No | Pilar | Tingkat Urgensi (Kritis / Sedang / Minor) | Lokasi File & Baris | Deskripsi Temuan Masalah | Dampak Terhadap Sistem | Solusi Kode Presisi |
3. **Rencana Aksi Perbaikan (Action Plan)** terurut dari yang paling kritis untuk segera dieksekusi.
```

---

## 📑 Alternatif: Prompt Audit Bertahap Per Modul (Staged Deep-Dive Audits)

Jika Anda ingin memeriksa modul tertentu secara lebih mendalam dan mikroskopis, gunakan salah satu dari prompt bertahap berikut:

### 1. 🏗️ Audit Modul 1: Astro Frontend & Core Web Vitals
```markdown
Bertindaklah sebagai Lead Frontend Performance Architect. Lakukan audit mikroskopis khusus pada arsitektur Astro di `/src` dan `/public`.
Fokus Pemeriksaan:
1. Efisiensi bundle JavaScript di `BaseLayout.astro` (defer scripts, dependency footprint).
2. Optimasi Core Web Vitals (LCP, FID/INP, CLS) pada komponen kartu (`ProjectCard.astro`, `BlogCard.astro`) dan hero section.
3. Kerapian penanganan gambar responsif dan pencegahan layout shift.
4. Kepatuhan SEO on-page: Canonical links, Schema.org @graph JSON-LD, BreadcrumbList, dan OpenGraph metadata.
Sajikan daftar temuan dengan rekomendasi kode before-vs-after yang siap dipasang.
```

### 2. 🎛️ Audit Modul 2: Admin Dashboard (`apps/dashboard`) & GitHub Storage
```markdown
Bertindaklah sebagai Senior React/TypeScript Application Engineer & Security Auditor. Lakukan audit mikroskopis khusus pada Admin Studio Dashboard di `/apps/dashboard`.
Fokus Pemeriksaan:
1. Alur upload media via GitHub API (`src/lib/github.ts`) dan komponen uploader (`ImageUploader.tsx`, `GalleryUploader.tsx`).
2. Validasi slug URL unik, auto-generation, dan pencatatan 301 redirects (`src/utils/slug.ts`).
3. Penanganan error koneksi Supabase & pencegahan data corruption pada `PortfolioEditor.tsx` dan `ArticleEditor.tsx`.
4. Keamanan penyimpanan credentials (token GitHub & Supabase anon key) di browser client.
Sajikan evaluasi keamanan, bug tersembunyi, dan snippet perbaikan TypeScript.
```

### 3. 🗄️ Audit Modul 3: Supabase Database, RLS & Edge Proxy
```markdown
Bertindaklah sebagai Principal Database Administrator & Cloudflare Edge Specialist. Lakukan audit mikroskopis pada konfigurasi backend dan edge delivery:
Fokus Pemeriksaan:
1. Skema database di `supabase/schema.sql`: Tipe data, relasi, constraint unik, default values, dan indexing.
2. Keamanan Row Level Security (RLS) policies untuk operasi SELECT, INSERT, UPDATE, dan DELETE.
3. Fungsi proxy Cloudflare (`functions/media/[[path]].ts`) dan file `public/_redirects`: Edge caching, rate limiting, and fallbacks.
Sajikan evaluasi keandalan backend, potensi celah keamanan, dan query/konfigurasi perbaikan.
```
