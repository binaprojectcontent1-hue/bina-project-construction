# Settings Page Redesign & Emoji Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely eliminate all native OS emojis from `Settings.tsx` and redesign the page into a balanced 2-column layout matching the premium Oceanic Studio design system (`#0E1E38`, `#22416D`, `rounded-[24px]`, pill buttons, micro-tooltips).

**Architecture:** 
- Convert `Settings.tsx` from an oversized 1-column layout with verbose documentation into a modern 2-column layout:
  - **Left Column (col-span-7)**: Cloudflare Live Publication controls, IndexNow search engine broadcast, and advanced Webhook configuration.
  - **Right Column (col-span-5, sticky)**: Real-time System Connection Health cards (GitHub, Supabase, Cloudflare) and Deploy Quota Monitor.
- Replace all native emojis (`🟢`, `⚠️`, `🔒`, `✅`) with SVG icons from Lucide (`CheckCircle2`, `AlertTriangle`, `Lock`, `Activity`, pulsing status indicators).
- Replace verbose tutorial text with subtle `<HelpTooltip>` components to make the UI clean, executive, and aesthetic.

**Tech Stack:** React 18, Tailwind CSS, Lucide Icons, TypeScript.

---

## Global Constraints
- **Zero Emojis**: Do not use any OS emojis anywhere in UI text, badges, or alerts. Use Lucide SVG icons and Tailwind styling exclusively.
- Preserve all existing Cloudflare deploy hooks, IndexNow submission logic, and rate limiter verification.
- Zero TypeScript compiler errors in `apps/dashboard`.

---

### Task 1: Overhaul `Settings.tsx` into Balanced 2-Column Oceanic Studio Layout

**Files:**
- Modify: `apps/dashboard/src/pages/Settings.tsx`

**Interfaces:**
- Props: `{ user?: User }`
- State: `hookUrl`, `cfSaved`, `cfTesting`, `cfTestResult`, `cfRateLimited`, `cfRemainingAttempts`, `quickDeploying`, `quickDeployResult`, `deployRateInfo`, `indexingRunning`, `manualUrlInput`, `manualSubmitting`, `indexingResult`, `showAdvanced`

- [ ] **Step 1: Eliminate All Native Emojis & Replace with Lucide SVGs**
Replace:
- `🟢 Terhubung` / `⚠️ Perlu Setup` -> `<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terhubung` or `<AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Perlu Setup`
- `🟢 Online` / `⚠️ Terputus` -> `<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Online` or `<AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Terputus`
- `🟢 Aktif` -> `<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Aktif`
- `🔒 Terkunci` / `✅ Aktif` -> `<Lock className="w-3.5 h-3.5 text-rose-600" /> Terkunci` / `<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Aktif`

- [ ] **Step 2: Restructure into Balanced 2-Column Grid**
- Container: `max-w-6xl mx-auto space-y-6 pb-16`
- Header: Signature Oceanic Header with `Settings` icon in `#22416D` square, subtitle, and live status badge with pulsing SVG dot.
- Left Column (`lg:col-span-7 space-y-5`):
  1. **Perbarui Website Live**:
     - Card `rounded-[24px]` with `#22416D` header icon.
     - Deploy button: pill `rounded-full bg-[#22416D] hover:bg-[#1A3356] text-white font-bold h-10 px-5 text-xs`.
     - Concise description with `<HelpTooltip>` instead of long paragraph.
     - Clean alert feedback for deployment result.
  2. **Pengindeksan Instan Mesin Pencari (IndexNow)**:
     - Card `rounded-[24px]` with `Radio` icon.
     - Compact buttons for broadcast all and single URL submission.
     - Clean domain key display with external link.
  3. **Pengaturan Webhook Lanjutan (Collapsible)**:
     - Card `rounded-[24px]` with `Key` icon.
     - Clean input with pill save and test buttons.
- Right Column (`lg:col-span-5 space-y-5 lg:sticky lg:top-4`):
  1. **Status Kuota Deploy (Card)**:
     - Deep oceanic accent card (`bg-gradient-to-br from-[#0B172C] via-[#0E1E38] to-[#142646] text-white rounded-[24px] border border-blue-900/40 p-5 shadow-lg`).
     - Display remaining deploy attempts (`remainingAttempts / 10`) with progress bar and status badge.
     - "Buka Website Asli" quick link button.
  2. **Status Koneksi Layanan (Card)**:
     - Card `rounded-[24px] border border-slate-200/80 bg-white p-5 space-y-3`.
     - 3 clean service rows: GitHub Media Storage, Supabase Database, Cloudflare Pages.
     - Pill badges with Lucide icons (no emojis).

---

### Task 2: End-to-End Verification

**Files:**
- Verification only

- [ ] **Step 1: Typecheck Dashboard**
Run `npm run --prefix apps/dashboard typecheck` and verify 0 errors.

- [ ] **Step 2: Grep Emoji Check**
Verify that zero native emojis remain in `apps/dashboard/src/pages/Settings.tsx`.

- [ ] **Step 3: Static Build Verification**
Run `npm run build` to confirm main Astro app build passes.
