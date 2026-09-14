# Multilingual English Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build complete bilingual English (`/en/`) and Indonesian (default `/`) support across the Bina Project public website with dynamic URL switching, SEO `hreflang` tags, and translated UI/HUD controls.

**Architecture:** Utilize Astro's native i18n routing (`prefixDefaultLocale: false`) with a zero-dependency, type-safe TypeScript dictionary (`src/i18n/ui.ts`) and path helpers (`src/i18n/utils.ts`). Integrate an architectural glassmorphism `ID | EN` switcher in both desktop navbar and mobile drawer, serving dedicated `/en/...` routes for Home, About, Portfolio, and Contact.

**Tech Stack:** Astro 5, TypeScript, TailwindCSS / Vanilla CSS, React 19, Leaflet.

**Spec:** `docs/superpowers/specs/2026-09-14-multilingual-en-design.md`

## Global Constraints

- Indonesian (`id`) remains default at root `/` with NO prefix (e.g. `/`, `/about`, `/portfolio`, `/contact`).
- English (`en`) is served strictly under `/en/` (e.g. `/en`, `/en/about`, `/en/portfolio`, `/en/contact`).
- Symmetrical bidirectional SEO `hreflang` tags (`id`, `en`, `x-default`) must be present on every page.
- Language switcher preserves the active page path when toggling between languages.
- Map HUD and categories must support English (*"Live On-Going Projects"*, *"New Construction"*, *"Renovation"*, *"Interior"*).
- All changes must pass `npm run build` with zero TypeScript or SSG errors.

---

### Task 1: Astro i18n Configuration

**Files:**
- Modify: `astro.config.mjs`
- Test: `scratch/test_i18n_config.mjs`

**Interfaces:**
- Produces: Astro configuration object with native `i18n` block (`defaultLocale: 'id'`, `locales: ['id', 'en']`, `routing.prefixDefaultLocale: false`).

- [ ] **Step 1: Write test script to verify Astro i18n config**

Create `scratch/test_i18n_config.mjs`:
```javascript
import fs from 'fs';
const config = fs.readFileSync('astro.config.mjs', 'utf-8');
if (!config.includes("defaultLocale: 'id'") || !config.includes("locales: ['id', 'en']")) {
  console.error("FAIL: Astro i18n config not found");
  process.exit(1);
}
console.log("PASS: Astro i18n config is present");
```

- [ ] **Step 2: Run test to verify it fails initially**

Run: `node scratch/test_i18n_config.mjs`  
Expected: FAIL with "FAIL: Astro i18n config not found"

- [ ] **Step 3: Update `astro.config.mjs` with i18n configuration**

Edit `astro.config.mjs`:
```javascript
export default defineConfig({
  site: import.meta.env.SITE || 'https://binaproject.com',
  compressHTML: true,
  i18n: {
    defaultLocale: 'id',
    locales: ['id', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
    icon(),
    react(),
  ],
  // ... rest unchanged
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scratch/test_i18n_config.mjs`  
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add astro.config.mjs
git commit -m "feat(i18n): configure Astro native i18n with Indonesian default and English locale"
```

---

### Task 2: Centralized i18n Dictionaries & Helpers

**Files:**
- Create: `src/i18n/ui.ts`
- Create: `src/i18n/utils.ts`
- Test: `scratch/test_i18n_utils.mjs`

**Interfaces:**
- Produces:
  - `languages: { id: string, en: string }`
  - `defaultLang: 'id'`
  - `ui: Record<'id' | 'en', Record<string, string>>`
  - `getLangFromUrl(url: URL): 'id' | 'en'`
  - `useTranslations(lang: 'id' | 'en'): (key: string) => string`
  - `getLocalizedPath(pathname: string, targetLang: 'id' | 'en'): string`

- [ ] **Step 1: Write verification test for i18n utilities**

Create `scratch/test_i18n_utils.mjs`:
```javascript
import { getLangFromUrl, useTranslations, getLocalizedPath } from '../src/i18n/utils.ts';

const enUrl = new URL('https://binaproject.com/en/about');
const idUrl = new URL('https://binaproject.com/about');

if (getLangFromUrl(enUrl) !== 'en') throw new Error('Failed to get en lang');
if (getLangFromUrl(idUrl) !== 'id') throw new Error('Failed to get id lang');

const tEn = useTranslations('en');
const tId = useTranslations('id');
if (tEn('nav.about') !== 'About Us') throw new Error('Translation mismatch for en');
if (tId('nav.about') !== 'Tentang Kami') throw new Error('Translation mismatch for id');

if (getLocalizedPath('/about', 'en') !== '/en/about') throw new Error('Path localization failed for en');
if (getLocalizedPath('/en/about', 'id') !== '/about') throw new Error('Path localization failed for id');
if (getLocalizedPath('/', 'en') !== '/en') throw new Error('Root to en failed');
if (getLocalizedPath('/en', 'id') !== '/') throw new Error('En to root failed');

console.log('PASS: All i18n utilities tests passed');
```

- [ ] **Step 2: Create `src/i18n/ui.ts` with bilingual dictionary**

Write dictionary covering navigation, CTA buttons, hero headlines, section headers, map HUD, and contact details.

- [ ] **Step 3: Create `src/i18n/utils.ts` with helper functions**

Implement `getLangFromUrl`, `useTranslations`, and `getLocalizedPath`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scratch/test_i18n_utils.mjs`  
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add src/i18n/ui.ts src/i18n/utils.ts
git commit -m "feat(i18n): add bilingual translation dictionaries and route localization helpers"
```

---

### Task 3: Language Switcher Component & Header Integration

**Files:**
- Create: `src/components/LanguageSwitcher.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/MobileMenu.astro`
- Test: `scratch/verify_switcher_ui.mjs`

**Interfaces:**
- Consumes: `getLangFromUrl`, `getLocalizedPath` from `src/i18n/utils.ts`
- Produces: Visual pill switcher toggling seamlessly between `ID` and `EN` while preserving the current route.

- [ ] **Step 1: Create `src/components/LanguageSwitcher.astro`**

Create component with pill dock styling:
```astro
---
import { getLangFromUrl, getLocalizedPath } from '@i18n/utils';

const currentLang = getLangFromUrl(Astro.url);
const currentPath = Astro.url.pathname;
const idPath = getLocalizedPath(currentPath, 'id');
const enPath = getLocalizedPath(currentPath, 'en');
---

<div class="lang-switcher-dock" role="navigation" aria-label="Language Selector">
  <a
    href={idPath}
    class={`lang-pill ${currentLang === 'id' ? 'active' : ''}`}
    aria-label="Bahasa Indonesia"
    aria-current={currentLang === 'id' ? 'true' : undefined}
  >
    ID
  </a>
  <span class="lang-divider">/</span>
  <a
    href={enPath}
    class={`lang-pill ${currentLang === 'en' ? 'active' : ''}`}
    aria-label="English"
    aria-current={currentLang === 'en' ? 'true' : undefined}
  >
    EN
  </a>
</div>

<style>
  .lang-switcher-dock {
    display: inline-flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 9999px;
    padding: 3px 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  }
  .lang-pill {
    padding: 3px 7px;
    border-radius: 9999px;
    color: #64748B;
    text-decoration: none;
    transition: all 0.2s ease;
  }
  .lang-pill:hover {
    color: #0E1E38;
  }
  .lang-pill.active {
    background: #183158;
    color: #FFFFFF;
    box-shadow: 0 1px 4px rgba(24, 49, 88, 0.25);
  }
  .lang-divider {
    color: #CBD5E1;
    margin: 0 1px;
    font-size: 10px;
  }
</style>
```

- [ ] **Step 2: Integrate `LanguageSwitcher` into `src/components/Header.astro`**

Import and place `<LanguageSwitcher />` in the desktop navbar right next to the `KONSULTASI GRATIS` CTA button.

- [ ] **Step 3: Integrate `LanguageSwitcher` into `src/components/MobileMenu.astro`**

Import and place `<LanguageSwitcher />` inside the mobile drawer header next to the close button.

- [ ] **Step 4: Verify rendering and styles**

Run `npm run build` or test dev server to verify layout alignment.

- [ ] **Step 5: Commit changes**

```bash
git add src/components/LanguageSwitcher.astro src/components/Header.astro src/components/MobileMenu.astro
git commit -m "feat(i18n): add glassmorphic LanguageSwitcher to desktop header and mobile drawer"
```

---

### Task 4: BaseLayout Support for Bilingual SEO & Hreflang

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Test: `scratch/test_hreflang_seo.mjs`

**Interfaces:**
- Consumes: `lang?: 'id' | 'en'` prop
- Produces: Correct `<html lang="id|en">`, symmetrical `<link rel="alternate" hreflang="id|en|x-default">`, and `og:locale`.

- [ ] **Step 1: Write test script to verify hreflang tags**

Create `scratch/test_hreflang_seo.mjs` inspecting generated HTML for `hreflang="id"` and `hreflang="en"`.

- [ ] **Step 2: Update `src/layouts/BaseLayout.astro`**

Update `Props` interface to accept `lang?: 'id' | 'en'`.
Compute:
```astro
const currentLang = Astro.props.lang || (Astro.url.pathname.startsWith('/en') ? 'en' : 'id');
const cleanPath = Astro.url.pathname.replace(/^\/en/, '') || '/';
const idUrl = `${cleanSiteUrl}${cleanPath === '/' ? '' : cleanPath}`;
const enUrl = `${cleanSiteUrl}/en${cleanPath === '/' ? '' : cleanPath}`;
```
Inject:
```html
<html class="no-js" lang={currentLang}>
  <link rel="alternate" hreflang="id" href={idUrl} />
  <link rel="alternate" hreflang="en" href={enUrl} />
  <link rel="alternate" hreflang="x-default" href={idUrl} />
  <meta property="og:locale" content={currentLang === 'en' ? 'en_US' : 'id_ID'} />
```

- [ ] **Step 3: Run test script to verify tags**

Run: `node scratch/test_hreflang_seo.mjs`  
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(seo): add automated bidirectional hreflang and localized html lang attributes to BaseLayout"
```

---

### Task 5: Live Projects Map Component English Support

**Files:**
- Modify: `src/components/LiveProjectsMap.tsx`
- Test: Browser verification of `/en/about#proyek-berjalan`

**Interfaces:**
- Consumes: `lang?: 'id' | 'en'` prop (defaults to `'id'`)
- Produces: English HUD controls (*"Live On-Going Projects"*, *"Active Projects In Progress"*, *"All Projects"*, *"New Construction"*, *"Renovation"*, *"Interior"*).

- [ ] **Step 1: Add `lang` prop to `LiveProjectsMap.tsx`**

```tsx
interface LiveProjectsMapProps {
  initialProjects?: LiveProjectRecord[];
  height?: string;
  lang?: 'id' | 'en';
}
```

- [ ] **Step 2: Localize HUD bar text and category filter buttons**

Translate labels conditionally:
- Category 'all': `lang === 'en' ? 'All Projects' : 'Semua Proyek'`
- Category 'konstruksi': `lang === 'en' ? 'New Construction' : 'Konstruksi Baru'`
- Category 'renovasi': `lang === 'en' ? 'Renovation' : 'Renovasi'`
- Category 'interior': `lang === 'en' ? 'Interior' : 'Interior'`
- Header badge: `lang === 'en' ? 'LIVE ON-GOING PROJECTS' : 'LIVE ON-GOING PROJECTS'`
- Subtitle: `lang === 'en' ? `${filteredProjects.length} Active Projects In Progress` : `${filteredProjects.length} Titik Proyek Aktif Sedang Berjalan``

- [ ] **Step 3: Commit changes**

```bash
git add src/components/LiveProjectsMap.tsx
git commit -m "feat(map): support English locale for HUD header, status badges, and category filters"
```

---

### Task 6: English Core Pages Implementation

**Files:**
- Create: `src/pages/en/index.astro`
- Create: `src/pages/en/about.astro`
- Create: `src/pages/en/contact.astro`
- Create: `src/pages/en/portfolio/index.astro`

**Interfaces:**
- Produces: Fully functional English routes matching their Indonesian counterparts with localized headings, SEO titles, descriptions, and CTA links.

- [ ] **Step 1: Create `src/pages/en/index.astro`**

Render English Homepage with translated meta tags, hero headline, service overview, and CTA buttons.

- [ ] **Step 2: Create `src/pages/en/about.astro`**

Render English About Us page including architectural values, company journey, leadership team, and `<LiveProjectsMap client:only="react" lang="en" />`.

- [ ] **Step 3: Create `src/pages/en/contact.astro`**

Render English Contact Us page with translated consultation form labels, office hours, and direct WhatsApp links.

- [ ] **Step 4: Create `src/pages/en/portfolio/index.astro`**

Render English Portfolio list page with translated category filter buttons (*"All"*, *"Construction"*, *"Interior"*, *"Renovation"*).

- [ ] **Step 5: Commit changes**

```bash
git add src/pages/en/
git commit -m "feat(pages): add core English pages (Home, About, Portfolio, and Contact)"
```

---

### Task 7: Comprehensive Build & Visual E2E Verification

**Files:**
- Create: `scratch/verify_multilingual_e2e.mjs`

- [ ] **Step 1: Run production build**

Run: `npm run build`  
Expected: Successful static page generation for all routes (`/` and `/en/...`) with exit code 0.

- [ ] **Step 2: Write E2E verification script**

Create `scratch/verify_multilingual_e2e.mjs` verifying:
1. `http://localhost:4321/` returns 200 with `lang="id"` and `hreflang` to `/en`.
2. `http://localhost:4321/en` returns 200 with `lang="en"` and `hreflang` to `/`.
3. `http://localhost:4321/en/about` returns 200 with English Map HUD and LanguageSwitcher.
4. Capture screenshots of desktop navbar switcher and mobile drawer.

- [ ] **Step 3: Execute verification script and inspect screenshots**

Run: `node scratch/verify_multilingual_e2e.mjs`  
Expected: All tests pass and visual screenshots verified.

- [ ] **Step 4: Commit test artifacts & walkthrough**

```bash
git add scratch/
git commit -m "test(i18n): verify bilingual routing, hreflang symmetry, and visual switcher"
```
