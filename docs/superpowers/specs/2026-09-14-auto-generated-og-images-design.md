# Design Spec: Auto-Generated Dynamic Open Graph Images for Blog & Portfolio

**Author:** Antigravity AI  
**Date:** 2026-09-14  
**Project:** Bina Project Construction & Interior (`binaproject.com`)  
**Status:** Approved by User via `/grill-me`

---

## 1. Goal & Context

Setiap artikel blog (`/blog/[slug]`) dan portofolio proyek (`/portfolio/[slug]`) di website Bina Project membutuhkan gambar pratinjau media sosial (Open Graph & Twitter Card) otomatis berukuran standar `1200 × 630 px`.

Saat ini, pratinjau hanya mengandalkan file `cover_image` mentah (jika ada) atau fallback umum `og-image.webp`. Dengan spesifikasi ini, sistem akan membuat gambar kartu visual bermerek (*branded card*) secara dinamis pada saat proses build SSG di Cloudflare Pages.

---

## 2. Design Decisions & User Preferences (from `/grill-me`)

1. **Strategi Pembuatan:**
   - Secara default, sistem membuat kartu **Split-Screen Modern** otomatis untuk setiap slug.
   - Admin di Dashboard Editor memiliki opsi toggle untuk memilih antara kartu grafis otomatis atau foto cover asli polos jika diinginkan.
2. **Arsitektur Teknis:**
   - **Build-time SSG di Astro:** Dibuat secara otomatis saat `astro build` berjalan di server CI/CD Cloudflare Pages.
   - **Zero Runtime Server:** 100% statis tersimpan di CDN (`dist/og/...`), cepat dan bebas biaya eksternal.
3. **Konsep Tata Letak (Split-Screen Modern 1200 × 630 px):**
   - **Separuh Kiri (~640 px):** Panel Bina Navy (`#1E3A5F` ke `#0E1E38`) berisi:
     - Logo vektor resmi Bina Project & tagline arsitektural.
     - Badge Kategori beraksen emas (`#F68A0A`) (misal: *Kitchen Set*, *Tips Renovasi*, *Konstruksi Bangunan*).
     - Judul artikel / portofolio dalam tipografi tebal (putih, auto-wrap & ellipsis jika panjang).
     - Metadata pendukung (lokasi kota untuk proyek, estimasi waktu baca untuk artikel).
     - Tanda pengenal brand domain: `binaproject.com`.
   - **Separuh Kanan (~560 px):** Foto sampul asli yang di-crop & fit secara proporsional. Jika konten belum memiliki foto sampul, menampilkan grafis arsitektur blueprint 3D Bina Project.
4. **Format & Rute URL:**
   - Endpoint statis: `/og/blog/[slug].png` dan `/og/portfolio/[slug].png`.
   - Bobot file ringan (< 100 KB) memenuhi standar ketat WhatsApp (< 500 KB), Facebook, Twitter, dan LinkedIn.

---

## 3. Architecture & File Structure

### A. Generator Service
- **`src/lib/ogGenerator.ts`**:
  - Fungsi `generateOgImage({ title, category, metaInfo, coverImageUrl, type })`:
    - Menghasilkan SVG buffer dengan layout Split-Screen.
    - Mengambil dan mengompresi gambar cover (lokal atau remote CDN) ke ukuran 560 × 630 px.
    - Menggabungkan elemen dengan `sharp.composite()` dan mengompresi output menjadi PNG berbobot ~30–75 KB.

### B. Static Endpoint Routes di Astro
- **`src/pages/og/blog/[slug].png.ts`**:
  - `getStaticPaths()` mengambil semua artikel dari `getAllArticles()`.
  - Mengembalikan file PNG binary dengan `Content-Type: image/png` dan cache header yang tepat.
- **`src/pages/og/portfolio/[slug].png.ts`**:
  - `getStaticPaths()` mengambil semua proyek dari `getAllProjects()`.
  - Mengembalikan file PNG binary dengan `Content-Type: image/png`.

### C. Public Page Meta Integration
- **`src/pages/blog/[slug].astro`**:
  - Set `ogImage = `${siteUrl}/og/blog/${slug}.png``.
- **`src/pages/portfolio/[slug].astro`**:
  - Set `ogImage = `${siteUrl}/og/portfolio/${slug}.png``.

### D. Dashboard Controls
- **`apps/dashboard/src/pages/ArticleEditor.tsx` & `PortfolioEditor.tsx`**:
  - Menambahkan toggle opsi pada grup pengaturan SEO:
    - *"Gunakan Kartu Grafis Split-Screen Otomatis (Direkomendasikan)"* vs *"Gunakan Foto Cover Asli Saja"*.

---

## 4. Verification & Testing

- **Komposisi Gambar:** Validasi ukuran `1200 × 630 px` dan bobot `< 120 KB` per file yang dihasilkan.
- **Uji WhatsApp & Open Graph:** Cek header `og:image` di `dist/blog/.../index.html` dan `dist/portfolio/.../index.html`.
- **Automated Typecheck & Build:** `npm run typecheck` dan `npm run build` sukses 0 error.
