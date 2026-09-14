# Admin-Controlled Before & After Slider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable managing and toggling the interactive Before & After Slider component on every project slug directly from the Admin Panel (`PortfolioEditor.tsx`) backed by Supabase.

**Architecture:** Add 5 columns (`enable_before_after`, `before_image`, `after_image`, `renovation_duration`, `transformation_scope`) to `public.projects`. Update Zod schema and React state in the admin dashboard with a dedicated toggle card and image uploaders. In Astro frontend (`[slug].astro`), conditionally render the slider between description and gallery only when `enable_before_after` is true and `before_image` exists.

**Tech Stack:** React 18, Vite, Zod, Lucide Icons (Dashboard), Astro 5, TypeScript, Supabase PostgreSQL.

**Spec:** [implementation_plan.md](file:///C:/Users/Nanda%20Addi/.gemini/antigravity-ide/brain/39f03f11-1785-4a39-9463-90571b256c2d/implementation_plan.md)

## Global Constraints
- Default state of `enable_before_after` is `false`.
- Graceful database saving fallback if Supabase schema migration has not yet been applied.
- Zero TypeScript errors (`npm run --prefix apps/dashboard typecheck` and `npx astro check`).
- Responsive on mobile and desktop.

---

### Task 1: Supabase Database Migration & Schema

**Files:**
- Create: `supabase/migrations/20260914_before_after_slider.sql`
- Modify: `supabase/schema.sql:15-25`

- [ ] **Step 1: Create SQL migration file**
- [ ] **Step 2: Update `supabase/schema.sql`**

---

### Task 2: Update TypeScript Interfaces & Zod Validation

**Files:**
- Modify: `src/types/database.ts:10-25`
- Modify: `apps/dashboard/src/schemas/portfolioSchema.ts:30-50`

- [ ] **Step 1: Add `enable_before_after?: boolean;` to `Project` interface**
- [ ] **Step 2: Add validation rules in `apps/dashboard/src/schemas/portfolioSchema.ts`**

---

### Task 3: Implement Before-After Controls in Admin Panel

**Files:**
- Modify: `apps/dashboard/src/pages/PortfolioEditor.tsx`

- [ ] **Step 1: Add state hooks and load from Supabase in `PortfolioEditor.tsx`**
- [ ] **Step 2: Add "Perbandingan Sebelum & Sesudah" UI Card with Toggle Switch**
- [ ] **Step 3: Update `handleSave` payload and graceful column fallback**
- [ ] **Step 4: Run dashboard typecheck (`npm run --prefix apps/dashboard typecheck`)**

---

### Task 4: Update Frontend Project Detail Pages

**Files:**
- Modify: `src/pages/portfolio/[slug].astro`
- Modify: `src/pages/en/portfolio/[slug].astro`

- [ ] **Step 1: Update render condition in `[slug].astro` (`project.enable_before_after && project.before_image`)**
- [ ] **Step 2: Update render condition in `en/portfolio/[slug].astro`**

---

### Task 5: Dynamic Showcase on Portfolio Index Pages

**Files:**
- Modify: `src/pages/portfolio/index.astro`
- Modify: `src/pages/en/portfolio/index.astro`

- [ ] **Step 1: Query active project with Before-After in `src/pages/portfolio/index.astro`**
- [ ] **Step 2: Query active project in `src/pages/en/portfolio/index.astro`**

---

### Task 6: Full Verification & Build Test

- [ ] **Step 1: Run dashboard typecheck (`npm run --prefix apps/dashboard typecheck`)**
- [ ] **Step 2: Run Astro check (`npx astro check`)**
- [ ] **Step 3: Run production build (`npm run build`)**
