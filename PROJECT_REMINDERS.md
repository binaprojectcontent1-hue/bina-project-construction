# 📌 PROJECT REMINDERS & CONTEXT SUMMARY: BINA PROJECT

Dokumen ini berisi rangkuman arsitektur modern, tumpukan teknologi (**Astro 5 + TypeScript + Supabase + jsDelivr CDN**), struktur komponen, panduan konfigurasi, dan catatan kritis untuk website **Bina Project (Bina Project Construction & Interior)**.

---

## 📌 Ringkasan Projek & Arsitektur Modern

### 1. Deskripsi & Tujuan
**Bina Project** adalah website profil perusahaan dan portofolio interaktif (*Company Profile & Dynamic Portfolio*) untuk penyedia jasa konstruksi bangunan, renovasi rumah, desain interior, kitchen set, waterproofing, developer, dan pembuatan maket di Malang & Jawa Timur.

### 2. Diagram Arsitektur Aplikasi (Astro 5 Architecture)

```mermaid
flowchart TD
    User([Pengunjung / Mesin Pencari Google]) --> AstroRouter[Astro 5 Static & Dynamic Engine]
    
    subgraph Layout_System[Sistem Layout & Komponen]
        BaseLayout[src/layouts/BaseLayout.astro]
        Header[src/components/Header.astro]
        Footer[src/components/Footer.astro]
        MobileMenu[src/components/MobileMenu.astro]
        SideMenu[src/components/SideMenu.astro]
        Breadcrumb[src/components/Breadcrumb.astro]
        ProjectCard[src/components/ProjectCard.astro]
        BlogCard[src/components/BlogCard.astro]
        ContactForm[src/components/ContactForm.astro]
    end
    
    subgraph Pages_Routing[Halaman & Routing]
        AstroRouter --> Home[src/pages/index.astro]
        AstroRouter --> About[src/pages/about.astro]
        AstroRouter --> PortfolioIndex[src/pages/portfolio/index.astro]
        AstroRouter --> PortfolioSlug[src/pages/portfolio/[slug].astro]
        AstroRouter --> BlogIndex[src/pages/blog/index.astro]
        AstroRouter --> BlogSlug[src/pages/blog/[slug].astro]
        AstroRouter --> Contact[src/pages/contact.astro]
        AstroRouter --> Terms[src/pages/syarat-ketentuan.astro]
        AstroRouter --> Error404[src/pages/404.astro]
    end

    subgraph Data_Layer[Data & Storage Layer]
        Service[src/lib/portfolioService.ts]
        SupabaseClient[src/lib/supabase.ts]
        CDNHelper[src/lib/cdn.ts]
        LocalSeed[(Embedded Resilient Fallback Dataset)]
        SupabaseDB[(Supabase PostgreSQL: projects)]
        GitHubCDN[(GitHub + jsDelivr CDN)]
    end

    PortfolioIndex --> Service
    PortfolioSlug --> Service
    Home --> Service
    Service -->|Online Mode| SupabaseClient --> SupabaseDB
    Service -->|Offline / Fallback| LocalSeed
    ProjectCard --> CDNHelper --> GitHubCDN
    BlogCard --> CDNHelper --> GitHubCDN
```

---

## 🛠️ Tech Stack & Environment

### Core & Framework
- **Framework**: [Astro 5](https://astro.build/) (Island Architecture, Fast SSG)
- **Language**: TypeScript (`tsconfig.json` with `@components/*`, `@layouts/*`, `@lib/*`, `@types/*` aliases)
- **Database**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Storage / CDN**: GitHub Repository + [jsDelivr CDN](https://www.jsdelivr.com/) (`src/lib/cdn.ts`)
- **SEO & Structured Data**: `@astrojs/sitemap`, OpenGraph, Twitter Cards, Schema.org `@graph` Connected Knowledge Graph (`WebSite`, `HomeAndConstructionBusiness`, `GeneralContractor`, `Organization`, `AggregateRating`, `OfferCatalog`, `FAQPage`, `CreativeWork`, and `Article`), Geo Meta Tags (Malang & East Java Local SEO).
- **CSS / UI**: Bootstrap 5 grid, FontAwesome 6, Swiper, Magnific Popup, NiceSelect, GSAP ScrollTrigger, Scoped Native Islands.

---

## 📁 Struktur Direktori Proyek

```
d:/binaproject/
├── dist/                     # Hasil kompilasi static production build (23 halaman + sitemap)
├── public/                   # Aset publik statis, favicon, robots.txt, assets/ (img, css, js)
│   ├── assets/               # Aset gambar terkompresi, stylesheet, dan library JS
│   └── robots.txt            # Konfigurasi Googlebot & sitemap
├── src/
│   ├── components/           # Komponen UI modular
│   │   ├── BaseLayout.astro  # Layout utama dengan SEO & JSON-LD
│   │   ├── Header.astro      # Topbar & navigasi responsif
│   │   ├── Footer.astro      # Footer terpusat & quick links
│   │   ├── MobileMenu.astro  # Menu navigasi samping perangkat mobile
│   │   ├── SideMenu.astro    # Info menu sidebar
│   │   ├── ProjectCard.astro # Kartu galeri portofolio + CDN helper
│   │   ├── BlogCard.astro    # Kartu artikel blog + CDN helper
│   │   ├── ContactForm.astro # Form kontak interaktif via WhatsApp / AJAX
│   │   ├── Breadcrumb.astro  # Navigasi remah roti halaman internal
│   │   ├── Preloader.astro   # Indikator loading animasi
│   │   └── ScrollToTop.astro # Tombol kembali ke atas dengan SVG circle
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── cdn.ts            # Helper konversi URL jsDelivr CDN
│   │   ├── supabase.ts       # Supabase client SDK initialization
│   │   ├── portfolioService.ts # Abstraksi data portofolio (Supabase + fallback)
│   │   └── blogService.ts    # Service & dataset artikel blog
│   ├── pages/
│   │   ├── index.astro       # Beranda utama
│   │   ├── about.astro       # Profil Tentang Kami
│   │   ├── portfolio/
│   │   │   ├── index.astro   # Galeri portofolio lengkap
│   │   │   └── [slug].astro  # Detail proyek dinamis
│   │   ├── blog/
│   │   │   ├── index.astro   # Daftar artikel tips & tren
│   │   │   └── [slug].astro  # Detail artikel blog dinamis
│   │   ├── contact.astro     # Kontak & Google Maps embed
│   │   ├── syarat-ketentuan.astro # Syarat & Ketentuan
│   │   └── 404.astro         # Halaman error 404
│   ├── styles/
│   │   └── global.css        # Global stylesheet imports
│   └── types/
│       └── database.ts       # Interface TypeScript Project & Article
├── supabase/
│   ├── schema.sql            # Skema DDL tabel Supabase (projects & articles)
│   └── seed.sql              # Seed SQL data awal portofolio lengkap
├── .env.example              # Template variabel lingkungan Supabase & CDN
├── .env                      # Variabel lingkungan aktif
├── astro.config.mjs          # Konfigurasi Astro & Sitemap
├── package.json              # Dependensi & script commands
└── tsconfig.json             # Konfigurasi TypeScript
```

---

## ⚡ Quickstart & Perintah Penting

```bash
# 1. Menjalankan Development Server (Hot Reload)
npm run dev

# 2. Membuat Production Build Statis
npm run build

# 3. Menjalankan Preview Hasil Build
npm run preview
```

---

## 💾 Panduan Menghubungkan ke Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan buat project baru.
2. Buka menu **SQL Editor** pada Supabase.
3. Jalankan isi file `supabase/schema.sql` untuk membuat tabel `projects` dan kebijakan akses publik.
4. Jalankan isi file `supabase/seed.sql` untuk memasukkan data awal seluruh proyek portofolio.
5. Salin **Project URL** dan **anon public API Key** dari *Project Settings -> API*.
6. Masukkan ke dalam file `.env`:
   ```env
   PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
7. Aplikasi otomatis langsung membaca data proyek secara *live* dari Supabase.

---

## 🌐 Panduan Konfigurasi jsDelivr CDN

Jika Anda ingin menyimpan file gambar di repository GitHub dan menyajikannya via jsDelivr CDN:
1. Masukkan informasi repository di `.env`:
   ```env
   PUBLIC_CDN_REPO=username/nama-repo
   PUBLIC_CDN_BRANCH=main
   ```
2. Helper `src/lib/cdn.ts` akan otomatis mengonversi path `assets/img/...` menjadi `https://cdn.jsdelivr.net/gh/username/nama-repo@main/assets/img/...`.
3. Jika variabel ini dikosongkan, aset otomatis dilayani dari penyimpanan lokal.
