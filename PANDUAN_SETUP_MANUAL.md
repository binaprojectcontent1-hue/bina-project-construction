# 📘 Panduan Lengkap Setup Manual: Admin Studio & GitHub Media Storage

Dokumen ini berisi panduan langkah demi langkah yang perlu Anda lakukan secara manual di layanan pihak ketiga (**GitHub**, **Supabase**, dan **Cloudflare**) agar seluruh sistem admin panel `dash.binaproject.com` dapat beroperasi penuh.

---

## 📑 Daftar Isi
1. [Langkah 1: Setup GitHub Media Storage (Skema A)](#langkah-1-setup-github-media-storage-skema-a)
2. [Langkah 2: Setup Database Supabase](#langkah-2-setup-database-supabase)
3. [Langkah 3: Menghubungkan Kredensial ke File `.env`](#langkah-3-menghubungkan-kredensial-ke-file-env)
4. [Langkah 4: Setup Cloudflare Pages & Subdomain](#langkah-4-setup-cloudflare-pages--subdomain)
5. [Langkah 5: Uji Coba Alur Pertama Kali (Publish & Deploy)](#langkah-5-uji-coba-alur-pertama-kali)

---

## Langkah 1: Setup GitHub Media Storage (Skema A)

Tujuan: Menyiapkan repository gratis di GitHub yang akan berfungsi sebagai **"Cloud Storage Bucket"** untuk menyimpan semua foto dokumentasi proyek dan gambar artikel.

### 1.1. Buat Repository Khusus Media
1. Buka [https://github.com/new](https://github.com/new) di browser Anda.
2. Isi **Repository name**: `bina-media` (atau nama lain yang Anda sukai).
3. Pilih opsi **Public** *(agar file foto dapat di-cache secara global oleh CDN gratis)*.
4. Centang kotak **Add a README file**.
5. Klik tombol hijau **Create repository**.

### 1.2. Buat GitHub Personal Access Token (PAT)
Token ini berfungsi sebagai "kunci akses" agar dashboard admin di browser bisa mengunggah file foto langsung ke repository `bina-media`.
1. Buka link pembuatan token: [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new?scopes=repo&description=BinaProjectStudio).
2. Di kolom **Note / Description**, isi: `Bina Project Studio Dashboard`.
3. Di bagian **Expiration**, pilih `No expiration` (atau 90 hari sesuai kebijakan Anda).
4. Di bagian **Select scopes**, pastikan Anda mencentang:
   - [x] **`repo`** *(Full control of private repositories & contents)*.
5. Scroll ke paling bawah halaman, klik tombol hijau **Generate token**.
6. **PENTING**: Salin dan simpan token tersebut (formatnya diawali `ghp_...`). *Token ini hanya ditampilkan satu kali oleh GitHub.*

### 1.3. Masukkan Konfigurasi ke Panel Admin
1. Buka dashboard admin di: [http://localhost:3000](http://localhost:3000).
2. Klik menu **Pengaturan** di sidebar kiri.
3. Di kartu **GitHub Media Storage (Skema A)**, isi:
   - **GitHub Username / Owner**: Username akun GitHub Anda (misal: `nanda-addi`).
   - **Nama Repository Media**: `bina-media`.
   - **Branch Utama**: `main`.
   - **GitHub Personal Access Token**: Tempelkan token `ghp_...` yang tadi Anda salin.
4. Klik tombol **Uji Koneksi GitHub API**. Jika berhasil, akan muncul notifikasi hijau `Terhubung ke repository bina-media`.
5. Klik **Simpan Konfigurasi GitHub**.

---

## Langkah 2: Setup Database Supabase

Tujuan: Menyiapkan database PostgreSQL untuk menyimpan data teks portofolio, artikel edukasi, status SEO, dan catatan 301 redirect.

1. Buka [https://supabase.com](https://supabase.com) dan login ke akun Anda.
2. Buat project baru (atau buka project yang sudah ada).
3. Buka menu **SQL Editor** di sidebar kiri Supabase.
4. Klik **New query**, lalu salin seluruh isi file yang ada di repository Anda:
   - Berkas: [supabase/schema.sql](file:///d:/binaproject/supabase/schema.sql)
5. Tempelkan query tersebut ke SQL Editor Supabase, lalu klik tombol **Run**.
6. *(Opsional - Data Demo)*: Jika ingin mengisi contoh portofolio awal, buka [supabase/seed.sql](file:///d:/binaproject/supabase/seed.sql), tempelkan ke SQL Editor, dan klik **Run**.

---

## Langkah 3: Menghubungkan Kredensial ke File `.env`

Tujuan: Menghubungkan aplikasi website utama dan panel admin ke database Supabase Anda.

1. Di Supabase Dashboard, buka menu **Settings** (ikon gear di pojok kiri bawah) &rarr; **API**.
2. Salin 2 nilai berikut:
   - **Project URL** (contoh: `https://xyzprojectid.supabase.co`)
   - **anon / public key** (kunci panjang diawali `eyJ...`)

3. Buka berkas [.env](file:///d:/binaproject/.env) di root proyek, isi nilainya:
   ```bash
   PUBLIC_SUPABASE_URL=https://xyzprojectid.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   PUBLIC_CDN_REPO=username-anda/bina-media
   PUBLIC_CDN_BRANCH=main
   ```

4. Buka berkas [apps/dashboard/.env](file:///d:/binaproject/apps/dashboard/.env), isi nilainya:
   ```bash
   VITE_SUPABASE_URL=https://xyzprojectid.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

---

## Langkah 4: Setup Cloudflare Pages & Subdomain

Tujuan: Mengatur agar website utama hidup di `binaproject.com` dan panel admin hidup di `dash.binaproject.com`.

### 4.1. Deploy Website Utama di Cloudflare Pages
1. Masuk ke [Cloudflare Dashboard](https://dash.cloudflare.com) &rarr; **Workers & Pages**.
2. Klik **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
3. Pilih repository GitHub website Anda (`binaproject`).
4. Pengaturan Build:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Tambahkan **Environment variables**:
   - `PUBLIC_SUPABASE_URL`: (URL Supabase Anda)
   - `PUBLIC_SUPABASE_ANON_KEY`: (Anon key Supabase Anda)
   - `PUBLIC_CDN_REPO`: `username-anda/bina-media`
   - `PUBLIC_CDN_BRANCH`: `main`
6. Klik **Save and Deploy**.
7. Di tab **Custom domains**, sambungkan domain utama Anda: `binaproject.com`.

### 4.2. Buat Deploy Hook (Untuk Tombol "Simpan & Deploy" di Admin)
1. Di proyek Cloudflare Pages website utama Anda, buka tab **Settings** &rarr; **Builds & deployments**.
2. Scroll ke bagian **Deploy hooks** &rarr; Klik **Add deploy hook**.
3. Beri nama: `BinaStudioAdminHook`.
4. Branch to build: `main`.
5. Klik **Add**, lalu **salin URL webhook** yang dihasilkan (contoh: `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/xxxxxx`).
6. Buka dashboard admin ([http://localhost:3000](http://localhost:3000)) &rarr; Menu **Pengaturan** &rarr; Tempelkan URL tersebut ke kolom **Deploy Hook Webhook URL** &rarr; Klik **Simpan Konfigurasi Cloudflare**.

### 4.3. Deploy Panel Admin di Subdomain `dash.binaproject.com`
1. Di Cloudflare Dashboard &rarr; **Workers & Pages** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
2. Pilih repo yang sama (`binaproject`).
3. Pengaturan Build untuk Dashboard:
   - **Root directory**: `apps/dashboard`
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Tambahkan Environment variables:
   - `VITE_SUPABASE_URL`: (URL Supabase)
   - `VITE_SUPABASE_ANON_KEY`: (Anon key Supabase)
5. Klik **Save and Deploy**.
6. Di tab **Custom domains**, tambahkan: **`dash.binaproject.com`**.
   *(Cloudflare akan otomatis membuatkan DNS CNAME dan sertifikat SSL gratis).*

---

## Langkah 5: Uji Coba Alur Pertama Kali

Setelah semua langkah di atas selesai, Anda siap mencoba alur publikasi perdana:

1. Buka **[http://localhost:3000](http://localhost:3000)** (atau `dash.binaproject.com` setelah dideploy).
2. Klik **+ Tambah Proyek**:
   - Isi judul proyek (misal: *Villa Tropis Modern Batu*).
   - Lihat bagaimana **Smart Slug Engine** membuat slug `/portfolio/villa-tropis-modern-batu`.
   - Klik area **Upload Foto** &rarr; Pilih foto dari laptop Anda.
   - Foto otomatis terunggah ke repository `bina-media` di GitHub!
   - Isi deskripsi dan pastikan Alt Text terisi.
   - Periksa **Google SERP Preview** di sebelah kanan.
3. Klik tombol **Simpan & Deploy**:
   - Data tersimpan di Supabase.
   - Sinyal deploy webhook terkirim otomatis ke Cloudflare Pages.
4. Dalam waktu ~45 detik, halaman proyek Anda sudah tayang di website publik dengan foto yang berdomain `https://binaproject.com/media/portfolio/...` dan langsung siap diindeks oleh Googlebot Images!
