# Panduan Lengkap Migrasi Domain: binaproject.com ke binaproject.id

Dokumen ini berisi panduan teknis operasional untuk menyelesaikan migrasi domain **Bina Project** dari `binaproject.com` ke `binaproject.id` pada layanan pihak ketiga (**Cloudflare**, **Supabase**, dan **Google Search Console**).

---

## 1. Konfigurasi Cloudflare Pages (Custom Domains)

Pastikan ketiga sub-project Cloudflare Pages terhubung ke domain `.id`:

### 1.1 Website Utama (`binaproject.id`)
1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → Pilih project website utama (`binaproject`).
2. Masuk ke tab **Custom domains** → Klik **Set up a custom domain**.
3. Masukkan: `binaproject.id` → Klik **Continue** → **Activate domain**.
4. Ulangi untuk: `www.binaproject.id` (otomatis diarahkan ke apex/root).

### 1.2 Admin Dashboard (`dash.binaproject.id`)
1. Masuk ke Cloudflare Dashboard → **Workers & Pages** → Pilih project `binaproject-dashboard`.
2. Masuk ke tab **Custom domains** → Klik **Set up a custom domain**.
3. Masukkan: `dash.binaproject.id` → Klik **Activate domain**.

### 1.3 Bio Link (`bio.binaproject.id`)
1. Masuk ke Cloudflare Dashboard → **Workers & Pages** → Pilih project `binaproject-biolink`.
2. Masuk ke tab **Custom domains** → Klik **Set up a custom domain**.
3. Masukkan: `bio.binaproject.id` → Klik **Activate domain**.

---

## 2. Setting 301 Permanent Redirect di Cloudflare (Penting untuk SEO Google)

Agar reputasi SEO, posisi ranking keyword (SERP), dan backlink lama dari `binaproject.com` tidak hilang, pasang aturan **301 Permanent Redirect** di Cloudflare untuk domain lama:

### Cara 1: Menggunakan Redirect Rules (Rekomendasi Cloudflare Terbaru)
1. Di Cloudflare Dashboard, pilih domain **`binaproject.com`**.
2. Masuk ke menu **Rules** → **Redirect Rules** → Klik **Create rule**.
3. Berikan nama rule: `Redirect All Traffic to binaproject.id`.
4. Pada bagian **When incoming requests match...**:
   - Pilih **All incoming requests**.
5. Pada bagian **Then... (URL Redirect)**:
   - Type: **Dynamic**
   - Expression:
     ```text
     concat("https://binaproject.id", http.request.uri.path)
     ```
   - Status code: **301 (Moved Permanently)**
   - Centang: **Preserve query string**.
6. Klik **Deploy**.

### Aturan Khusus Subdomain (Dashboard & Bio Link):
Jika ingin traffic lama `dash.binaproject.com` dan `bio.binaproject.com` juga dialihkan:
- Buat Rule dengan kriteria `Hostname equals dash.binaproject.com`:
  - Target URL: `https://dash.binaproject.id` (301)
- Buat Rule dengan kriteria `Hostname equals bio.binaproject.com`:
  - Target URL: `https://bio.binaproject.id` (301)

---

## 3. Konfigurasi Supabase Auth

Karena panel admin berpindah ke `dash.binaproject.id`, Supabase Authentication harus mengenali domain baru:

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) → Pilih Project `binaproject` (`jymlsrmilckmphwhsrld`).
2. Masuk ke menu **Authentication** → **URL Configuration**.
3. Ubah **Site URL**:
   ```text
   https://dash.binaproject.id
   ```
4. Pada bagian **Redirect URLs**, tambahkan tautan berikut:
   - `https://dash.binaproject.id/**`
   - `https://dash.binaproject.id`
   - `https://binaproject.id/**`
   - `http://localhost:3000/**` (untuk development lokal)
   - `http://localhost:5173/**`
   *(Catatan: Jangan hapus `https://dash.binaproject.com/**` terlebih dahulu selama masa transisi).*
5. Klik **Save**.

---

## 4. Eksekusi Migrasi Database Supabase (SQL Script)

Untuk memperbarui seluruh URL gambar yang sudah tersimpan di database dari `https://binaproject.com/media/...` ke `https://binaproject.id/media/...`:

1. Buka Supabase Dashboard → **SQL Editor** → Klik **New Query**.
2. Buka file [supabase/migrations/20260920_domain_migration_to_id.sql](file:///d:/binaproject/supabase/migrations/20260920_domain_migration_to_id.sql).
3. Salin seluruh kodenya dan tempelkan ke SQL Editor Supabase.
4. Klik **Run**.
5. Jalankan query verifikasi di baris akhir untuk memastikan 0 record lama yang tersisa.

---

## 5. Google Search Console & Mesin Pencari (SEO Handover)

Langkah ini krusial agar Google segera mengindeks domain baru dan mentransfer ranking halaman:

1. **Tambahkan Properti Baru:**
   - Buka [Google Search Console](https://search.google.com/search-console).
   - Klik **Add Property** → Pilih tipe **Domain** → Masukkan `binaproject.id`.
   - Lakukan verifikasi DNS TXT record di Cloudflare DNS.

2. **Kirimkan Sitemap Baru:**
   - Di properti `binaproject.id`, masuk ke menu **Sitemaps**.
   - Masukkan: `sitemap-index.xml` dan `sitemap.xml` → Klik **Submit**.

3. **Gunakan Fitur Change of Address (Pemindahan Alamat):**
   - Buka properti lama Anda (`binaproject.com`).
   - Masuk ke **Settings** → **Change of address**.
   - Pilih properti baru Anda: `binaproject.id`.
   - Klik **Validate & Update**. Google akan memvalidasi redirect 301 dan mulai mengalihkan ranking secara resmi.

4. **Bing Webmaster Tools & IndexNow:**
   - Daftarkan `binaproject.id` di Bing Webmaster Tools.
   - Script build di project ini (`scripts/ping-sitemap.mjs`) telah dikonfigurasi untuk menyiarkan seluruh URL secara otomatis ke IndexNow (`host: binaproject.id`).

---

## 6. Checklist Penyelesaian

- [x] Konfigurasi codebase Astro (`astro.config.mjs`, `site.ts`, `cdn.ts`, `ogGenerator.ts`, `ContactForm.astro`, `whatsapp.ts`, `robots.txt`, `llms.txt`, `llms-full.txt`, `llms-context.json`)
- [x] Konfigurasi Admin Dashboard (`index.html`, `indexing.ts`, `media.ts`, `github.ts`, `LiveProjectImageUploader.tsx`, `PortfolioList.tsx`, `ArticleList.tsx`, `Login.tsx`, `Settings.tsx`, `BioLinkEditor.tsx`, `Navbar.tsx`, `Sidebar.tsx`)
- [x] Konfigurasi Bio Link (`index.html`, `App.tsx`, `_redirects`)
- [x] Skrip SQL Migrasi Supabase siap dijalankan (`20260920_domain_migration_to_id.sql`)
- [ ] Menghubungkan Custom Domain di Cloudflare Pages
- [ ] Mengaktifkan Redirect Rule 301 di Cloudflare
- [ ] Memperbarui Site URL & Redirect URLs di Supabase Auth
- [ ] Menjalankan SQL migration script di Supabase SQL Editor
- [ ] Mengajukan Change of Address di Google Search Console
