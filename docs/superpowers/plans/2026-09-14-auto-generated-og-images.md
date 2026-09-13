# Auto-Generated Dynamic Open Graph Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menghasilkan gambar kartu Open Graph (OG) 1200 × 630 px bermerek modern secara otomatis pada saat build SSG untuk setiap artikel blog (`/blog/[slug]`) dan portofolio proyek (`/portfolio/[slug]`) di `binaproject.com`, lengkap dengan kontrol opsi di dashboard editor.

**Architecture:** SSG Static Endpoints di Astro (`src/pages/og/blog/[slug].png.ts` & `src/pages/og/portfolio/[slug].png.ts`) merender kartu grafis Split-Screen beresolusi 1200 × 630 px menggunakan `sharp` (SVG layout + image crop composite) saat proses `astro build`, menghasilkan file PNG statis berukuran < 100 KB di `dist/og/`. Halaman detail blog dan portofolio menyematkan rute statis ini ke tag `<meta property="og:image">` dan `twitter:image`. Admin dashboard menyediakan toggle pilihan tampilan antara kartu otomatis atau foto cover asli.

**Tech Stack:** Astro v5 (SSG Static Endpoints), Sharp (v0.34+ image compositing & SVG rendering), TypeScript, TailwindCSS/React (Dashboard Editor), Zod, Supabase.

**Spec:** `docs/superpowers/specs/2026-09-14-auto-generated-og-images-design.md`

## Global Constraints

- Standar dimensi OG: Tepat 1200 × 630 px, rasio 1.91:1.
- Target bobot file: < 120 KB (jauh di bawah batas mutlak WhatsApp 500 KB agar pratinjau chat instan muncul).
- Desain split-screen: Panel kiri ~640 px warna Navy `#1E3A5F` ke `#0E1E38` dengan badge emas `#F68A0A`, teks putih wrapped, logo Bina Project, dan watermark domain `binaproject.com`; Panel kanan ~560 px berisi cover proyek/artikel (atau blueprint wireframe jika tidak ada cover).
- Zero Serverless Cost: 100% dibuat saat build-time (`astro build`), disajikan statis tanpa runtime backend tambahan di Cloudflare Pages.
- TypeScript strictness: `npm run typecheck` dan `npm run typecheck:dash` harus 0 error.

---

### Task 1: Database Types & Optional Migration

**Files:**
- Create: `supabase/migrations/20260914_og_image_type.sql`
- Modify: `src/types/database.ts:15-24,35-45`
- Modify: `apps/dashboard/src/schemas/articleSchema.ts:40-52`
- Modify: `apps/dashboard/src/schemas/portfolioSchema.ts:35-48`

**Interfaces:**
- Consumes: `PublishStatus`, existing `Project` & `Article` interfaces.
- Produces: `og_image_type?: 'branded' | 'raw_cover'` on `Project` and `Article`, with validation in Zod schemas.

- [ ] **Step 1: Create SQL migration file**

```sql
-- supabase/migrations/20260914_og_image_type.sql
-- ==============================================================================
-- BINA PROJECT SUPABASE MIGRATION: OG IMAGE TYPE TOGGLE
-- Migration Date: 2026-09-14
-- Description: Adds og_image_type to projects and articles ('branded' | 'raw_cover')
-- ==============================================================================

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS og_image_type VARCHAR(20) DEFAULT 'branded';

ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS og_image_type VARCHAR(20) DEFAULT 'branded';
```

- [ ] **Step 2: Update TypeScript types in `src/types/database.ts`**

Tambahkan `og_image_type?: 'branded' | 'raw_cover'` ke interface `Project` dan `Article`:

```typescript
// src/types/database.ts (snippet)
export interface Project {
  id?: string;
  slug: string;
  title: string;
  category: 'Eksterior' | 'Interior' | 'Konstruksi' | 'Kitchen Set' | string;
  location: string;
  project_date: string;
  client?: string;
  description: string;
  cover_image: string;
  gallery_images: string[];
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  alt_cover_image?: string;
  og_image_type?: 'branded' | 'raw_cover';
  status?: PublishStatus;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Article {
  id?: string;
  slug: string;
  title: string;
  author: string;
  publish_date: string;
  category: string;
  excerpt: string;
  content: string;
  cover_image: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  alt_cover_image?: string;
  og_image_type?: 'branded' | 'raw_cover';
  status?: PublishStatus;
  reading_time?: number;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}
```

- [ ] **Step 3: Update Zod validation schemas in Dashboard**

Tambahkan `og_image_type` ke `articleSchema.ts` dan `portfolioSchema.ts`:

```typescript
// apps/dashboard/src/schemas/articleSchema.ts
  og_image_type: z.enum(['branded', 'raw_cover']).default('branded').optional(),

// apps/dashboard/src/schemas/portfolioSchema.ts
  og_image_type: z.enum(['branded', 'raw_cover']).default('branded').optional(),
```

- [ ] **Step 4: Run typecheck to verify schemas and types**

Run: `npm run typecheck && npm run typecheck:dash`  
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260914_og_image_type.sql src/types/database.ts apps/dashboard/src/schemas/
git commit -m "feat(seo): add og_image_type schema and database types"
```

---

### Task 2: Core OG Image Generator Service with Sharp

**Files:**
- Create: `src/lib/ogGenerator.ts`
- Create: `scripts/test-og-generator.mjs`

**Interfaces:**
- Consumes: `sharp`, `fs`, Node `fetch` / CDN resolution.
- Produces: `generateOgImage(options: OgImageOptions): Promise<Buffer>`
  - `options`: `{ title: string; category?: string; metaInfo?: string; coverImageUrl?: string; type?: 'blog' | 'portfolio' }`
  - Output: PNG Buffer `1200 × 630` px, weight `< 100 KB`.

- [ ] **Step 1: Write test script `scripts/test-og-generator.mjs`**

```javascript
// scripts/test-og-generator.mjs
import fs from 'node:fs';
import path from 'node:path';
import { generateOgImage } from '../src/lib/ogGenerator.ts';

async function runTest() {
  console.log('Testing OG Image Generator...');

  // Test 1: Generate Blog Card (with dummy/blueprint fallback)
  const blogBuf = await generateOgImage({
    title: 'Tips Memilih Material Kitchen Set Minimalis Anti Rayap & Lembap',
    category: 'TIPS & EDUKASI',
    metaInfo: '4 Menit Baca',
    type: 'blog',
  });

  if (!Buffer.isBuffer(blogBuf)) throw new Error('Result is not a buffer');
  console.log(`✓ Blog OG Generated: ${blogBuf.length} bytes (${Math.round(blogBuf.length / 1024)} KB)`);

  // Test 2: Generate Portfolio Card with local asset cover
  const portfolioBuf = await generateOgImage({
    title: 'Modern Minimalist Living & Kitchen Set di Sleman Yogyakarta',
    category: 'INTERIOR DESIGN',
    metaInfo: 'Sleman, D.I. Yogyakarta',
    coverImageUrl: 'public/assets/img/og-image.webp',
    type: 'portfolio',
  });

  console.log(`✓ Portfolio OG Generated: ${portfolioBuf.length} bytes (${Math.round(portfolioBuf.length / 1024)} KB)`);

  // Verification
  if (blogBuf.length > 120 * 1024) throw new Error(`Blog OG exceeds 120 KB: ${blogBuf.length}`);
  if (portfolioBuf.length > 120 * 1024) throw new Error(`Portfolio OG exceeds 120 KB: ${portfolioBuf.length}`);

  const outputDir = path.resolve('dist-test');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'test-blog-og.png'), blogBuf);
  fs.writeFileSync(path.join(outputDir, 'test-portfolio-og.png'), portfolioBuf);
  console.log('✓ Test output saved to dist-test/ for visual review.');
}

runTest().catch((err) => {
  console.error('OG Generator test failed:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Run test script to verify it fails (module not found)**

Run: `node --loader ts-node/esm scripts/test-og-generator.mjs` (or node running the TS runner)  
Expected: FAIL (`Cannot find module '../src/lib/ogGenerator.ts'`).

- [ ] **Step 3: Implement `src/lib/ogGenerator.ts`**

```typescript
// src/lib/ogGenerator.ts
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

export interface OgImageOptions {
  title: string;
  category?: string;
  metaInfo?: string;
  coverImageUrl?: string;
  type?: 'blog' | 'portfolio';
}

/**
 * Helper to escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Word wrap helper for SVG text
 */
function wrapText(text: string, maxCharsPerLine: number = 24, maxLines: number = 3): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      if (lines.length >= maxLines - 1) {
        break;
      }
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  // If there were more words, append ellipsis to last line
  const totalLength = lines.join(' ').length;
  if (totalLength < text.length && lines.length > 0) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:!?\s]+$/, '') + '...';
  }

  return lines;
}

/**
 * Creates SVG Left Panel Overlay (640 × 630 px)
 */
function createLeftPanelSvg(options: OgImageOptions): Buffer {
  const category = escapeXml(options.category?.toUpperCase() || (options.type === 'portfolio' ? 'PROYEK ARSITEKTUR' : 'TIPS & EDUKASI'));
  const metaInfo = escapeXml(options.metaInfo || (options.type === 'portfolio' ? 'Bina Project' : '3 Menit Baca'));
  const titleLines = wrapText(options.title || 'Bina Project Construction & Interior', 24, 3);

  const titleSvgSpans = titleLines
    .map((line, idx) => `<tspan x="70" dy="${idx === 0 ? 0 : 54}">${escapeXml(line)}</tspan>`)
    .join('');

  const svg = `
  <svg width="640" height="630" viewBox="0 0 640 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E3A5F" />
        <stop offset="100%" stop-color="#0E1E38" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F68A0A" />
        <stop offset="100%" stop-color="#FFA439" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="640" height="630" fill="url(#navyGrad)" />

    <!-- Subtle Architectural Grid on Left Panel -->
    <g opacity="0.06" stroke="#FFFFFF" stroke-width="1">
      <line x1="70" y1="0" x2="70" y2="630" />
      <line x1="200" y1="0" x2="200" y2="630" />
      <line x1="330" y1="0" x2="330" y2="630" />
      <line x1="460" y1="0" x2="460" y2="630" />
      <line x1="0" y1="120" x2="640" y2="120" />
      <line x1="0" y1="240" x2="640" y2="240" />
      <line x1="0" y1="360" x2="640" y2="360" />
      <line x1="0" y1="480" x2="640" y2="480" />
    </g>

    <!-- Logo & Brand Header -->
    <g transform="translate(70, 65)">
      <!-- Bina Project Monogram Icon -->
      <rect width="36" height="36" rx="8" fill="url(#goldGrad)" />
      <path d="M10 26V10L18 15V26H10Z" fill="#1E3A5F" />
      <path d="M18 15L26 20V26H18V15Z" fill="#0E1E38" opacity="0.7" />
      <text x="48" y="24" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF" letter-spacing="1">BINA PROJECT</text>
    </g>

    <!-- Category Badge -->
    <g transform="translate(70, 145)">
      <rect width="${Math.max(120, category.length * 9 + 32)}" height="32" rx="16" fill="#F68A0A" fill-opacity="0.16" stroke="#F68A0A" stroke-width="1" />
      <text x="16" y="21" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#F68A0A" letter-spacing="1.5">${category}</text>
    </g>

    <!-- Article / Project Title -->
    <text x="70" y="240" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="40" font-weight="800" fill="#FFFFFF" line-height="1.2">
      ${titleSvgSpans}
    </text>

    <!-- Meta Info (Reading Time or City Location) -->
    <g transform="translate(70, 475)">
      <circle cx="8" cy="8" r="4" fill="#F68A0A" />
      <text x="24" y="12" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#94A3B8">${metaInfo}</text>
    </g>

    <!-- Footer Watermark & Domain Badge -->
    <g transform="translate(70, 545)">
      <text font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#F68A0A" letter-spacing="0.5">binaproject.com</text>
      <text x="135" y="0" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="400" fill="#64748B">• Jasa Konstruksi &amp; Interior Terpercaya</text>
    </g>

    <!-- Right Side Divider Glow -->
    <line x1="639" y1="0" x2="639" y2="630" stroke="#F68A0A" stroke-opacity="0.3" stroke-width="2" />
  </svg>
  `;

  return Buffer.from(svg);
}

/**
 * Creates Blueprint Architectural Illustration Fallback (560 × 630 px)
 */
function createBlueprintFallbackSvg(): Buffer {
  const svg = `
  <svg width="560" height="630" viewBox="0 0 560 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="560" height="630" fill="#132644" />
    <!-- Architectural Blueprint Grid -->
    <g stroke="#1E3A5F" stroke-width="1" opacity="0.6">
      ${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${i * 45}" x2="560" y2="${i * 45}" />`).join('')}
      ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 45}" y1="0" x2="${i * 45}" y2="630" />`).join('')}
    </g>
    <!-- Isometric 3D Architectural Wireframe -->
    <g transform="translate(140, 180)" stroke="#F68A0A" stroke-width="2" fill="none" opacity="0.75">
      <polygon points="140,0 280,70 140,140 0,70" stroke="#FFFFFF" fill="#1E3A5F" fill-opacity="0.4" />
      <polygon points="0,70 140,140 140,280 0,210" stroke="#F68A0A" fill="#0E1E38" fill-opacity="0.6" />
      <polygon points="280,70 140,140 140,280 280,210" stroke="#FFFFFF" fill="#162D4D" fill-opacity="0.6" />
      <!-- Interior Elements Wireframe -->
      <line x1="50" y1="95" x2="50" y2="235" stroke="#F68A0A" stroke-dasharray="4,4" />
      <line x1="90" y1="115" x2="90" y2="255" stroke="#F68A0A" stroke-dasharray="4,4" />
      <line x1="230" y1="95" x2="230" y2="235" stroke="#94A3B8" stroke-dasharray="4,4" />
    </g>
    <text x="280" y="520" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#64748B" letter-spacing="2">ARCHITECTURAL BLUEPRINT</text>
  </svg>
  `;
  return Buffer.from(svg);
}

/**
 * Loads and resizes right cover image to 560 × 630 px
 */
async function loadCoverBuffer(coverImageUrl?: string): Promise<Buffer> {
  if (!coverImageUrl) {
    return sharp(createBlueprintFallbackSvg()).png().toBuffer();
  }

  try {
    let sourceBuffer: Buffer | null = null;

    if (coverImageUrl.startsWith('http://') || coverImageUrl.startsWith('https://')) {
      const res = await fetch(coverImageUrl);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        sourceBuffer = Buffer.from(arrayBuf);
      }
    } else {
      // Local or relative path resolution
      const cleanPath = coverImageUrl.startsWith('/') ? coverImageUrl.slice(1) : coverImageUrl;
      const localDirectPath = path.resolve(cleanPath);
      const publicPath = path.resolve('public', cleanPath);

      if (fs.existsSync(localDirectPath)) {
        sourceBuffer = fs.readFileSync(localDirectPath);
      } else if (fs.existsSync(publicPath)) {
        sourceBuffer = fs.readFileSync(publicPath);
      } else {
        // Fallback to jsDelivr CDN
        const cdnUrl = `https://cdn.jsdelivr.net/gh/binaprojectcontent1-hue/bina-media@main/${cleanPath.replace(/^media\//, '')}`;
        const cdnRes = await fetch(cdnUrl);
        if (cdnRes.ok) {
          sourceBuffer = Buffer.from(await cdnRes.arrayBuffer());
        }
      }
    }

    if (sourceBuffer) {
      return await sharp(sourceBuffer)
        .resize(560, 630, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
    }
  } catch (err) {
    console.warn(`[ogGenerator] Failed to load cover image "${coverImageUrl}", using blueprint fallback:`, err);
  }

  return sharp(createBlueprintFallbackSvg()).png().toBuffer();
}

/**
 * Main Generator: Produces a 1200 × 630 px PNG buffer
 */
export async function generateOgImage(options: OgImageOptions): Promise<Buffer> {
  const leftOverlay = createLeftPanelSvg(options);
  const rightCover = await loadCoverBuffer(options.coverImageUrl);

  // Composite 1200 × 630 image:
  // Base 1200 × 630 canvas with Navy background
  const baseCanvas = sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 14, g: 30, b: 56, alpha: 1 },
    },
  });

  return await baseCanvas
    .composite([
      { input: rightCover, left: 640, top: 0 },
      { input: leftOverlay, left: 0, top: 0 },
    ])
    .png({ quality: 85, compressionLevel: 9 })
    .toBuffer();
}
```

- [ ] **Step 4: Run test script to verify it passes**

Run: `node scripts/test-og-generator.mjs`  
Expected: PASS with output size ~30–75 KB for both images.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ogGenerator.ts scripts/test-og-generator.mjs
git commit -m "feat(og): implement core sharp-based split-screen OG image generator"
```

---

### Task 3: Astro Static Endpoints for Blog & Portfolio

**Files:**
- Create: `src/pages/og/blog/[slug].png.ts`
- Create: `src/pages/og/portfolio/[slug].png.ts`

**Interfaces:**
- Consumes: `getAllArticles()` from `src/lib/blogService.ts`, `getAllProjects()` from `src/lib/portfolioService.ts`, `generateOgImage()` from `src/lib/ogGenerator.ts`.
- Produces: Binary PNG response with `Content-Type: image/png` and static paths for all slugs.

- [ ] **Step 1: Create `src/pages/og/blog/[slug].png.ts`**

```typescript
// src/pages/og/blog/[slug].png.ts
import type { APIRoute } from 'astro';
import { getAllArticles } from '@lib/blogService';
import { generateOgImage } from '@lib/ogGenerator';

export const prerender = true;

export async function getStaticPaths() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    params: { slug: article.slug },
    props: { article },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { article } = props as { article: any };

  if (!article) {
    return new Response('Not Found', { status: 404 });
  }

  const pngBuffer = await generateOgImage({
    title: article.title,
    category: article.category,
    metaInfo: `${article.reading_time || 3} Menit Baca`,
    coverImageUrl: article.cover_image,
    type: 'blog',
  });

  return new Response(pngBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
```

- [ ] **Step 2: Create `src/pages/og/portfolio/[slug].png.ts`**

```typescript
// src/pages/og/portfolio/[slug].png.ts
import type { APIRoute } from 'astro';
import { getAllProjects } from '@lib/portfolioService';
import { generateOgImage } from '@lib/ogGenerator';

export const prerender = true;

export async function getStaticPaths() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { project } = props as { project: any };

  if (!project) {
    return new Response('Not Found', { status: 404 });
  }

  const pngBuffer = await generateOgImage({
    title: project.title,
    category: project.category,
    metaInfo: project.location || 'Yogyakarta',
    coverImageUrl: project.cover_image,
    type: 'portfolio',
  });

  return new Response(pngBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
```

- [ ] **Step 3: Run Astro check to verify endpoint types**

Run: `npm run typecheck`  
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/og/blog/\[slug\].png.ts src/pages/og/portfolio/\[slug\].png.ts
git commit -m "feat(og): add Astro SSG static endpoints for blog and portfolio OG images"
```

---

### Task 4: Public Page Integration for Social Meta Tags

**Files:**
- Modify: `src/pages/blog/[slug].astro:70-78`
- Modify: `src/pages/portfolio/[slug].astro:100-108`

**Interfaces:**
- Consumes: `siteConfig.siteUrl`, `article.og_image_type`, `project.og_image_type`.
- Produces: Injected full URL for `ogImage` (e.g. `https://binaproject.com/og/blog/${article.slug}.png`) into `<BaseLayout>`.

- [ ] **Step 1: Update `src/pages/blog/[slug].astro`**

Tentukan `ogImageUrl`:
```typescript
// Di dalam frontmatter src/pages/blog/[slug].astro:
const ogImageUrl =
  article.og_image_type === 'raw_cover' && coverUrl
    ? coverUrl
    : `${siteConfig.siteUrl}/og/blog/${article.slug}.png`;
```

Lalu teruskan ke `<BaseLayout>`:
```astro
<BaseLayout
  title={pageTitle}
  description={pageDescription}
  ogImage={ogImageUrl}
  canonicalUrl={canonicalSlugUrl}
  type="article"
  preloadImage={coverUrl}
>
```

- [ ] **Step 2: Update `src/pages/portfolio/[slug].astro`**

Tentukan `ogImageUrl`:
```typescript
// Di dalam frontmatter src/pages/portfolio/[slug].astro:
const ogImageUrl =
  project.og_image_type === 'raw_cover' && coverUrl
    ? coverUrl
    : `${siteConfig.siteUrl}/og/portfolio/${project.slug}.png`;
```

Lalu teruskan ke `<BaseLayout>`:
```astro
<BaseLayout
  title={pageTitle}
  description={pageDescription}
  ogImage={ogImageUrl}
  canonicalUrl={canonicalSlugUrl}
  preloadImage={coverUrl}
>
```

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`  
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/\[slug\].astro src/pages/portfolio/\[slug\].astro
git commit -m "feat(seo): link dynamic OG image URLs to blog and portfolio meta tags"
```

---

### Task 5: Dashboard Editor OG Mode Selector

**Files:**
- Modify: `apps/dashboard/src/pages/ArticleEditor.tsx`
- Modify: `apps/dashboard/src/pages/PortfolioEditor.tsx`

**Interfaces:**
- Consumes: Form state, Zod schema (`og_image_type`), safe database update.
- Produces: UI selector in SEO section for choosing "Branded OG Card" (default) or "Cover Asli", without breaking if database column is optional.

- [ ] **Step 1: Add OG Mode state & safe save handling in `ArticleEditor.tsx`**

1. Tambahkan state:
```typescript
const [ogImageType, setOgImageType] = useState<'branded' | 'raw_cover'>('branded');
```

2. Pada saat memuat artikel (`loadArticle`):
```typescript
if (data.og_image_type) {
  setOgImageType(data.og_image_type);
}
```

3. Pada `payload`, sertakan `og_image_type: ogImageType`.

4. Pada bagian form SEO (di bawah input Meta Description), tambahkan UI komponen seleksi kartu OG:
```tsx
{/* OG Social Share Preview Selector */}
<div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50 space-y-3">
  <div className="flex items-center justify-between">
    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
      Tampilan Gambar Media Sosial (OG Image)
    </label>
    <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
      WhatsApp, FB, Twitter
    </span>
  </div>
  <p className="text-xs text-slate-500">
    Pilih format gambar yang tampil saat tautan artikel dibagikan di media sosial.
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
    <button
      type="button"
      onClick={() => { setOgImageType('branded'); setIsDirty(true); }}
      className={`p-3 rounded-lg border text-left transition-all ${
        ogImageType === 'branded'
          ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-2 font-medium text-xs text-slate-900">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Kartu Split-Screen Modern
        <span className="text-[10px] text-amber-600 font-bold bg-amber-100 px-1.5 py-0.2 rounded">Otomatis</span>
      </div>
      <p className="text-[11px] text-slate-500 mt-1">
        1200×630 px dengan logo resmi, judul rapi, badge kategori, dan foto cover di sebelah kanan.
      </p>
    </button>
    <button
      type="button"
      onClick={() => { setOgImageType('raw_cover'); setIsDirty(true); }}
      className={`p-3 rounded-lg border text-left transition-all ${
        ogImageType === 'raw_cover'
          ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-2 font-medium text-xs text-slate-900">
        <span className="w-2 h-2 rounded-full bg-slate-400" />
        Foto Sampul Asli Saja
      </div>
      <p className="text-[11px] text-slate-500 mt-1">
        Menggunakan file cover polos tanpa grafis tambahan.
      </p>
    </button>
  </div>
</div>
```

- [ ] **Step 2: Add OG Mode state & UI in `PortfolioEditor.tsx`**

Lakukan hal serupa di `PortfolioEditor.tsx` untuk konsistensi form portofolio.

- [ ] **Step 3: Run dashboard typecheck**

Run: `npm run typecheck:dash`  
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/src/pages/ArticleEditor.tsx apps/dashboard/src/pages/PortfolioEditor.tsx
git commit -m "feat(dashboard): add OG preview card mode selector in article and portfolio editors"
```

---

### Task 6: Full System Build, Static Asset Validation & Verification

**Files:**
- Test output check: `dist/og/blog/*.png`, `dist/og/portfolio/*.png`

**Interfaces:**
- Consumes: Complete codebase build.
- Produces: Verified production build artifacts and confirmed WhatsApp size compliance.

- [ ] **Step 1: Run comprehensive TypeScript verification**

Run:
```bash
npm run typecheck
npm run typecheck:dash
```
Expected: Both exit with code 0 and no diagnostic errors.

- [ ] **Step 2: Run production SSG build**

Run:
```bash
npm run build
```
Expected: Build completes successfully; Astro logs generation of `/og/blog/[slug].png` and `/og/portfolio/[slug].png`.

- [ ] **Step 3: Verify output PNG files in `dist/og/`**

Run node verification script:
```bash
node -e "
const fs = require('fs');
const glob = (dir) => fs.readdirSync(dir, { recursive: true });
console.log('Generated OG Images:', glob('dist/og'));
"
```
Expected: All generated `.png` files exist and are `< 120 KB`.

- [ ] **Step 4: Commit and Push**

```bash
git status
git add .
git commit -m "chore(release): complete auto-generated dynamic OG images system"
git push origin main
```
