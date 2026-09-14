# Multilingual English Support Design Specification

**Feature:** Multilingual (ID/EN) Support for Bina Project Public Website  
**Date:** 2026-09-14  
**Status:** Approved  
**Author:** Bina Project Team & Antigravity  

---

## 1. Executive Summary

Bina Project is expanding its audience to international and bilingual clients by introducing English multilingual support across its primary public website (`binaproject.com`). The default primary language remains Indonesian (`id`), preserving all existing URL structures, backlinks, and local search authority (Kota Malang, Jawa Timur). English content is cleanly routed under the `/en/` sub-path prefix with bidirectional SEO `hreflang` tags.

---

## 2. Global Constraints & Requirements

1. **URL & Routing Strategy:**
   - Default language: Indonesian (`id`), served at root `/` (e.g. `/`, `/about`, `/portfolio`, `/contact`). No `/id/` prefix to prevent 301 redirects and preserve local SEO rankings.
   - Secondary language: English (`en`), served under `/en/` (e.g. `/en`, `/en/about`, `/en/portfolio`, `/en/contact`).
2. **Framework Integration:**
   - Astro 4+ native i18n configuration in `astro.config.mjs`:
     ```javascript
     i18n: {
       defaultLocale: 'id',
       locales: ['id', 'en'],
       routing: {
         prefixDefaultLocale: false,
         redirectToDefaultLocale: false
       }
     }
     ```
3. **Translation System:**
   - Type-safe centralized dictionary in `src/i18n/ui.ts` without heavy external runtime dependencies.
   - Utility helpers in `src/i18n/utils.ts` for route parsing, localized path generation, and dictionary lookup.
4. **Dynamic Database Content Policy:**
   - All navigation, categories (*"New Construction"*, *"Renovation"*, *"Interior Design"*), UI labels, progress indicators, map HUD, and forms are translated to English.
   - Specific project names and documentation photo titles loaded from Supabase/static data retain their original naming, framed by English metadata and badges.
5. **SEO & Internationalization:**
   - Correct `<html lang="id">` vs `<html lang="en">`.
   - `<link rel="alternate" hreflang="id" href="..." />`
   - `<link rel="alternate" hreflang="en" href="..." />`
   - `<link rel="alternate" hreflang="x-default" href="..." />`
   - `og:locale` (`id_ID` vs `en_US`).

---

## 3. Component Architecture & Data Flow

### 3.1 Dictionary (`src/i18n/ui.ts`)
Defines structured translations:
- `nav`: Navigation links (`home`, `about`, `portfolio`, `liveProjects`, `articles`, `contact`).
- `cta`: Call-to-action buttons (*"Konsultasi Gratis"* -> *"Free Consultation"*, *"Hubungi Kami"* -> *"Contact Us"*).
- `hero`: Taglines, value propositions, and trust stats.
- `services`: Master service titles, architectural scopes, and descriptions.
- `map`: Live projects HUD controls (*"Live On-Going Projects"*, *"All Projects"*, *"New Construction"*, *"Renovation"*, *"Interior"*, *"Active Locations"*).
- `contact`: Contact info, form labels, and consultation details.
- `footer`: Company description, quick links, and copyright.

### 3.2 Utilities (`src/i18n/utils.ts`)
- `getLangFromUrl(url: URL): 'id' | 'en'`
- `useTranslations(lang: 'id' | 'en'): (key: string) => string`
- `getLocalizedPath(pathname: string, targetLang: 'id' | 'en'): string`
  - `/about` -> `/en/about`
  - `/en/about` -> `/about`
  - `/` -> `/en`
  - `/en` -> `/`

### 3.3 Language Switcher Component (`src/components/LanguageSwitcher.astro`)
- Glassmorphism pill button displaying `ID | EN`.
- Detects the current path and calculates equivalent destination URL.
- Highlights active language pill with brand navy background (`#183158`) and white text (`#FFFFFF`).
- Seamlessly fits into:
  1. Desktop Header navbar next to the CTA button.
  2. Mobile Menu drawer header for easy one-tap switching on smartphones.

### 3.4 Page Structure
```
src/pages/
├── index.astro                 (Indonesian Home)
├── about.astro                 (Indonesian About)
├── contact.astro               (Indonesian Contact)
├── portfolio/
│   ├── index.astro             (Indonesian Portfolio List)
│   └── [slug].astro            (Indonesian Project Detail)
└── en/
    ├── index.astro             (English Home)
    ├── about.astro             (English About)
    ├── contact.astro           (English Contact)
    └── portfolio/
        └── index.astro         (English Portfolio List)
```

---

## 4. Verification & Testing Strategy

1. **Astro Build & SSG Validation:**
   - Execute `npm run build` to verify all `/en/...` routes render statically without TypeScript or routing errors.
2. **SEO & Meta Verification:**
   - Inspect `<head>` tags on both `/` and `/en/` for matching `hreflang`, `canonical`, and `og:locale`.
3. **Language Switcher Interaction:**
   - Verify switching between `/about` and `/en/about` preserves page context.
   - Verify mobile drawer switcher behaves identically.
4. **Visual & Design Consistency:**
   - Ensure English UI components match the brand's aesthetic (Plus Jakarta Sans, glassmorphism, responsive container alignment).
