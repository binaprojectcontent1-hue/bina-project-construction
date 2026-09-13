# Design Spec: Bio Link Page (Linktree-style) — bio.binaproject.com

**Author:** Antigravity AI  
**Date:** 2026-09-14  
**Project:** Bina Project Construction & Interior  
**Status:** Approved by User via `/grill-me`

---

## 1. Goal & Context

Membuat halaman bio link ala Linktree di domain `bio.binaproject.com` yang dapat dikelola sepenuhnya dari panel admin dashboard yang sudah ada. Halaman publik menampilkan daftar link penting Bina Project dalam format tombol-tombol modern ber-icon Lucide, dengan latar belakang efek Particles animasi dari React Bits, dan tema dark Navy brand identity.

---

## 2. Design Decisions (from `/grill-me`)

1. **Arsitektur:** Vite + React SPA baru di `apps/biolink/`, deploy terpisah ke Cloudflare Pages dengan custom domain `bio.binaproject.com`.
2. **Penyimpanan Data:** Supabase tabel baru `biolinks` — konsisten dengan infrastruktur yang sudah ada.
3. **Panel Admin:** Halaman baru `BioLinkEditor.tsx` di Dashboard Admin (`apps/dashboard`), dengan fitur drag-and-drop reorder, toggle aktif/nonaktif, dan preview live.
4. **Background Effect:** React Bits `Particles` — titik-titik cahaya bergerak halus di atas latar gelap Navy.
5. **Elemen Tampilan:** Logo Bina Project, foto profil (opsional), nama brand, tagline, daftar link utama (icon + judul), ikon sosial media di bawah.
6. **Tema Warna:** Dark Navy `#0E1E38` base + aksen Gold `#F68A0A`.
7. **Analitik Klik:** Tracking sederhana via kolom `click_count` integer di tabel Supabase.
8. **Format Link:** Rounded button shadcn-style + icon Lucide, hover glow emas.

---

## 3. Database Schema

### Tabel `biolinks`
```sql
CREATE TABLE IF NOT EXISTS public.biolinks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'globe',
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    click_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabel `biolink_settings`
```sql
CREATE TABLE IF NOT EXISTS public.biolink_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_name VARCHAR(100) DEFAULT 'Bina Project',
    tagline VARCHAR(200) DEFAULT 'Jasa Konstruksi & Interior Terpercaya',
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Architecture & File Structure

### A. Bio Link Public SPA (`apps/biolink/`)
- **`apps/biolink/src/App.tsx`**: Root komponen, fetch data dari Supabase, render layout.
- **`apps/biolink/src/components/Particles.tsx`**: Copy-paste komponen Particles dari React Bits (zero-dependency, self-contained WebGL).
- **`apps/biolink/src/components/BioCard.tsx`**: Kartu utama berisi logo, nama, tagline, list link buttons.
- **`apps/biolink/src/components/LinkButton.tsx`**: Tombol link individual dengan icon Lucide, hover glow gold.
- **`apps/biolink/src/components/SocialBar.tsx`**: Baris ikon sosial media di bawah.
- **`apps/biolink/src/lib/supabase.ts`**: Client Supabase (public read-only).

### B. Dashboard Admin Extension (`apps/dashboard/`)
- **`apps/dashboard/src/pages/BioLinkEditor.tsx`**: Halaman CRUD biolink di panel admin — list, add, edit, delete, reorder (drag-and-drop), toggle aktif/nonaktif, preview link.
- Perlu update: `Sidebar.tsx` (tambah tab `biolink`), `App.tsx` (tambah route), tipe `TabType`.

---

## 5. Verification & Testing

- **TypeScript:** `npm run typecheck:dash` dan typecheck biolink app harus 0 error.
- **Build:** `npm run build` (biolink) dan `npm run build:dash` sukses.
- **Visual:** Preview live halaman bio link di browser dev lokal.
