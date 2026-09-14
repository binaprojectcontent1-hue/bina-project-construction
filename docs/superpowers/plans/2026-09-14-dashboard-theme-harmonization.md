# Dashboard Theme Harmonization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harmonize out-of-theme pages in the Admin Dashboard (`apps/dashboard`), focusing on `RedirectsList.tsx` and `Settings.tsx`, bringing them into complete visual alignment with the signature Oceanic Studio design system (`#0E1E38`, `#22416D`, `rounded-[24px]`, pill buttons).

**Architecture:** 
- Align design tokens, headers, buttons, cards, and modal components across `RedirectsList.tsx` and `Settings.tsx` with the patterns established in `Overview.tsx`, `PortfolioList.tsx`, and `BusinessProfileSettings.tsx`.
- Introduce 3 KPI metric cards in `RedirectsList.tsx` for executive summary view.
- Transform `Settings.tsx` into an Oceanic Studio hero layout with deep oceanic cards (`#0E1E38` to `#152B49`) for the live publication section and rounded-full pill buttons.
- Remove orphaned scratch files (`ArticleList_solar.tsx`).

**Tech Stack:** React 18, Tailwind CSS, Lucide Icons, TypeScript.

---

## Global Constraints
- Preserve all existing functionality, Supabase queries, rate limiting, and Cloudflare deploy logic intact.
- Zero TypeScript typecheck errors in `apps/dashboard`.
- Use signature color tokens: `#22416D` (primary oceanic blue), `#1A3356` (hover), `#0E1E38` (dark oceanic gradient start), `#080E18` (deep background).

---

### Task 1: Clean Up Orphaned File `ArticleList_solar.tsx`

**Files:**
- Delete: `apps/dashboard/src/pages/ArticleList_solar.tsx`

- [ ] **Step 1: Delete orphaned scratch file**
Remove `apps/dashboard/src/pages/ArticleList_solar.tsx` which is an incomplete 17-line test file from early prototyping.

---

### Task 2: Redesign `RedirectsList.tsx` into Oceanic Studio Theme

**Files:**
- Modify: `apps/dashboard/src/pages/RedirectsList.tsx`

**Interfaces:**
- Props: none (`RedirectsList: React.FC`)
- Data: `source_path`, `target_path`, `status_code`, `created_at`

- [ ] **Step 1: Implement Oceanic Page Header & KPI Cards**
Update header with:
- Top bar with `Shuffle` icon in rounded `#22416D` square.
- Title `text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight`.
- Live status badge: `Sistem Redirect 301 Aktif`.
- Pill buttons: `rounded-full bg-[#22416D] text-white` for "+ Tambah Redirect Manual" and `rounded-full` for refresh.
- 3 KPI stat cards:
  1. *Total Aturan Redirect* (with `Shuffle` icon)
  2. *301 Permanent (SEO Safe)* (with `CheckCircle2` icon)
  3. *302 Sementara (Temporary)* (with `Clock` icon)

- [ ] **Step 2: Implement Filter Toolbar & Modern Table Shell**
- Search bar inside a `rounded-[24px]` card with status filter buttons (Semua, 301 Permanent, 302 Temporary).
- Table container with `rounded-[24px]` card, clean header typography, monospace pill badges for URL source and target, and sleek delete button with hover effect.

- [ ] **Step 3: Redesign Manual Redirect Modal**
- Modal container with `rounded-[24px]`, backdrop blur, oceanic accent header, clean input focus states, and pill action buttons (`rounded-full bg-[#22416D] text-white`).

---

### Task 3: Redesign `Settings.tsx` into Oceanic Studio Theme

**Files:**
- Modify: `apps/dashboard/src/pages/Settings.tsx`

- [ ] **Step 1: Implement Signature Oceanic Header**
- Header with `Settings` icon in rounded `#22416D` square.
- Title `text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight`.
- Subtitle and connection status indicator.

- [ ] **Step 2: Transform Hero Card "Perbarui Website Live"**
- Style the live deployment card with a deep oceanic gradient (`bg-gradient-to-br from-[#0B172C] via-[#0E1E38] to-[#142646] text-white rounded-[24px] border border-blue-900/40 shadow-xl`).
- High-visibility hero deploy button (`bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-bold h-11 px-6 shadow-md`).
- Sleek dark stat box for remaining attempts (`deployRateInfo.remainingAttempts}/10`).
- Pill link to "Lihat Website Asli".

- [ ] **Step 3: Harmonize IndexNow & System Connection Cards**
- Update IndexNow card with `rounded-[24px]`, pill action buttons, and cleaner monospace keys.
- Update "Status Koneksi Layanan" with `rounded-[24px]` card and refined service badges.
- Style the collapsible "Pengaturan Teknis Lanjutan" with clean dark borders and pill test buttons.

---

### Task 4: End-to-End Verification

**Files:**
- Verification only

- [ ] **Step 1: Typecheck Dashboard**
Run `npm run --prefix apps/dashboard typecheck` and verify 0 errors.

- [ ] **Step 2: Static Build Verification**
Run `npm run build` to confirm main Astro app build remains 100% green.
