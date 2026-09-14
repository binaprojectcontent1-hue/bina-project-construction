# Interactive Before-After Transformation Slider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-dependency, GPU-accelerated interactive Before-After Image Comparison Slider component with auto-peek sweep animation and integrate it into the Portfolio index and Project Detail pages.

**Architecture:** A lightweight Astro component (`BeforeAfterSlider.astro`) utilizing CSS `clip-path` and custom CSS variable `--slider-pos` driven by pointer and touch event handlers. An `IntersectionObserver` triggers a one-time fluid auto-peek sweep animation (Apple cubic-bezier easing) when the slider scrolls into view.

**Tech Stack:** Astro 5, TypeScript, Vanilla CSS (with Apple physics & glassmorphism tokens), SVG Icons (`astro-icon`).

**Spec:** [implementation_plan.md](file:///C:/Users/Nanda%20Addi/.gemini/antigravity-ide/brain/39f03f11-1785-4a39-9463-90571b256c2d/implementation_plan.md)

## Global Constraints
- Zero external UI libraries (vanilla JS pointer/touch events only).
- Smooth 60fps performance using CSS `clip-path` and `will-change`.
- Responsive across mobile (touch) and desktop (mouse).
- Accessible keyboard controls (Left/Right arrows adjust slider).
- Respect `prefers-reduced-motion` by disabling the auto-peek sweep.

---

### Task 1: TypeScript Database Schema Update

**Files:**
- Modify: `src/types/database.ts:1-25`

**Interfaces:**
- Produces: `Project` interface with `before_image?: string;`, `after_image?: string;`, `renovation_duration?: string;`, `transformation_scope?: string;`

- [ ] **Step 1: Update `Project` interface in `src/types/database.ts`**
- [ ] **Step 2: Verify TypeScript types pass with `npx astro check`**

---

### Task 2: Visual Assets Preparation (Before & After Images)

**Files:**
- Create: `src/assets/images/portfolio/facade_before.png`
- Create: `src/assets/images/portfolio/facade_after.png`

**Interfaces:**
- Produces: Visual image assets for the featured transformation case.

- [ ] **Step 1: Generate high quality before and after architectural facade assets**
- [ ] **Step 2: Confirm assets exist and are optimized**

---

### Task 3: Build `BeforeAfterSlider.astro` Component

**Files:**
- Create: `src/components/BeforeAfterSlider.astro`

**Interfaces:**
- Consumes: Image paths, title, subtitle, location, duration, and cta details.
- Produces: Interactive split-screen slider with auto-peek sweep animation and touch/mouse controls.

- [ ] **Step 1: Create `BeforeAfterSlider.astro`**
- [ ] **Step 2: Verify component compiles without errors**

---

### Task 4: Integrate Featured Transformation Showcase into Portfolio Index

**Files:**
- Modify: `src/pages/portfolio/index.astro`

**Interfaces:**
- Consumes: `<BeforeAfterSlider />` component and facade assets.

- [ ] **Step 1: Import and place `BeforeAfterSlider` in `src/pages/portfolio/index.astro`**
- [ ] **Step 2: Verify page build with `npx astro check`**

---

### Task 5: Integrate Before-After Section into Project Detail Page

**Files:**
- Modify: `src/pages/portfolio/[slug].astro`

**Interfaces:**
- Consumes: `project.before_image` and `project.after_image`.

- [ ] **Step 1: Conditionally render `BeforeAfterSlider` in `[slug].astro`**
- [ ] **Step 2: Verify detail page routing and type correctness**

---

### Task 6: Full Verification & Build Test

**Files:**
- Test all affected pages

- [ ] **Step 1: Run complete type-check (`npx astro check`)**
- [ ] **Step 2: Run production build (`npm run build`)**
