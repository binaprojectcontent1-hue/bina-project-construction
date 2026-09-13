# Panduan Setup & Deploy Bio Link (bio.binaproject.com) di Cloudflare Pages

Panduan ini menjelaskan langkah mudah menghubungkan sub-aplikasi Bio Link ke domain **`bio.binaproject.com`** menggunakan Cloudflare Pages.

---

## 1. Setup Database di Supabase (Satu Kali)

Buka **Supabase Dashboard** → **SQL Editor** → **New Query**, salin dan jalankan seluruh isi file migrasi berikut:
[`supabase/migrations/20260914_biolinks.sql`](file:///d:/binaproject/supabase/migrations/20260914_biolinks.sql)

File ini akan otomatis membuat:
- Tabel `public.biolinks` (dengan starter seed links untuk WhatsApp, Website, Portfolio, dll)
- Tabel `public.biolink_settings` (nama profil & tagline)
- Row-Level Security (RLS) policies
- Fungsi RPC `increment_biolink_click` untuk pelacakan klik atomic.

---

## 2. Deploy Project Baru di Cloudflare Pages

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → Tab **Pages** → **Connect to Git**.
2. Pilih repository GitHub: `binaproject`.
3. Isi konfigurasi build:
   - **Project Name:** `binaproject-biolink` (atau sesuai pilihan Anda)
   - **Production Branch:** `main`
   - **Framework preset:** `Vite` (atau `None`)
   - **Root directory:** `apps/biolink`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Di bagian **Environment Variables (Production)**, tambahkan 2 variabel (sama seperti dashboard):
   - `VITE_SUPABASE_URL`: `https://your-supabase-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-anon-key`
5. Klik **Save and Deploy**.

---

## 3. Menghubungkan Custom Domain `bio.binaproject.com`

1. Masuk ke project Pages `binaproject-biolink` di Cloudflare Dashboard.
2. Buka tab **Custom domains** → Klik **Set up a custom domain**.
3. Masukkan: `bio.binaproject.com`.
4. Jika domain `binaproject.com` sudah di Cloudflare DNS, Cloudflare akan mengonfigurasi CNAME DNS record secara otomatis dan menerbitkan sertifikat SSL HTTPS instan.
5. Selesai! Halaman bio link Anda kini live di `https://bio.binaproject.com`.

---

## 4. Pengelolaan via Panel Admin

Buka Dashboard Admin Bina Project di menu **Kelola Konten** → **Bio Link (Linktree)** (`#biolink`):
- Anda dapat menambah tautan baru, mengubah urutan (drag atau tombol panah naik/turun), mengaktifkan/menonaktifkan link instan, serta melihat statistik total klik per link.
- Pratinjau tampilan mobile interaktif (WYSIWYG) tersedia di sebelah kanan form.
