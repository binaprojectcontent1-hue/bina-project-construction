# Panduan Deployment Cloudflare Pages: dash.binaproject.id

Panduan langkah demi langkah untuk mendeploy dashboard admin ke subdomain **`dash.binaproject.id`** di **Cloudflare Pages**.

---

## 1. Setup Project di Cloudflare Pages

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Pilih repository `binaproject`.
3. Pada halaman konfigurasi build:
   - **Project name:** `binaproject-dashboard`
   - **Production branch:** `main`
   - **Framework preset:** `Vite`
   - **Root directory:** `apps/dashboard`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`

---

## 2. Masukkan Environment Variables di Cloudflare

Di halaman pengaturan build Cloudflare Pages (atau via **Settings → Environment variables**):

| Variable | Nilai | Keterangan |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` | URL Project Supabase Anda |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | Anon/Public API Key Supabase |
| `VITE_CLOUDFLARE_DEPLOY_HOOK_URL` | `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/...` | Hook dari project website utama |

Klik **Save and Deploy**.

---

## 3. Hubungkan Subdomain `dash.binaproject.id`

1. Setelah build pertama selesai, masuk ke tab **Custom domains** pada project `binaproject-dashboard`.
2. Klik **Set up a custom domain**.
3. Masukkan domain: `dash.binaproject.id`.
4. Cloudflare otomatis membuat DNS CNAME record yang aman dengan sertifikat SSL Cloudflare aktif.

---

## 4. Cara Membuat Deploy Hook untuk Website Utama

Agar tombol *"Publish & Deploy"* di dashboard dapat me-rebuild website utama (`binaproject.id`):

1. Masuk ke Cloudflare Dashboard → **Workers & Pages** → Pilih project website utama (`binaproject`).
2. Masuk ke **Settings** → **Builds & deployments** → Scroll ke bawah ke bagian **Deploy hooks**.
3. Klik **Add deploy hook**:
   - **Hook name:** `Dashboard Publish Hook`
   - **Branch:** `main`
4. Copy URL yang dihasilkan (berawalan `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/...`).
5. Masukkan URL tersebut ke menu **Pengaturan** di `dash.binaproject.id` (atau tambahkan ke variable `VITE_CLOUDFLARE_DEPLOY_HOOK_URL`).

---

## 5. Keamanan & Isolasi SEO

Dashboard ini telah dilengkapi dengan:
- `public/robots.txt` (`Disallow: /`)
- Tag `<meta name="robots" content="noindex, nofollow" />`
- Memastikan Googlebot tidak akan pernah mengindeks dashboard internal admin, menjaga ranking dan reputasi domain publik Anda 100% bersih.
