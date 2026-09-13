# Bio Link Page (bio.binaproject.com) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Linktree-style bio link page at `bio.binaproject.com` with Particles animated background, shadcn-style link buttons, and full admin management from the existing dashboard.

**Architecture:** Vite + React SPA in `apps/biolink/` for the public-facing page, with a new `BioLinkEditor.tsx` admin page in the existing `apps/dashboard/`. Data stored in Supabase (`biolinks` + `biolink_settings` tables). Public page uses read-only Supabase queries; admin dashboard uses authenticated CRUD operations. Particles background from React Bits (ogl WebGL).

**Tech Stack:** React 18, Vite, TypeScript, Supabase, ogl (WebGL), lucide-react, shadcn-style components

**Spec:** `docs/superpowers/specs/2026-09-14-biolink-page-design.md`

## Global Constraints

- Node.js >= 22.0.0
- React 18 (not 19)
- TypeScript strict mode
- Supabase for all data storage (same instance as main project, env vars `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`)
- Brand colors: Navy `#0E1E38` (base dark), Gold `#F68A0A` (accent), White `#FFFFFF` (text)
- UI language: Bahasa Indonesia for admin, English acceptable for public bio page
- All biolink app files under `apps/biolink/`
- All dashboard changes in `apps/dashboard/`

---

### Task 1: Database Schema — Supabase Migration

**Files:**
- Create: `supabase/migrations/20260914_biolinks.sql`

**Interfaces:**
- Produces: Tables `biolinks` and `biolink_settings` in Supabase, available for query from both dashboard and biolink apps.

- [ ] **Step 1: Create migration file**

```sql
-- ==============================================================================
-- BINA PROJECT SUPABASE MIGRATION: BIO LINK TABLES
-- Migration Date: 2026-09-14
-- Description: Creates biolinks and biolink_settings tables for bio.binaproject.com
-- ==============================================================================

-- Bio Links — individual link entries
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

-- Enable Row-Level Security
ALTER TABLE public.biolinks ENABLE ROW LEVEL SECURITY;

-- Public read access (for the bio link page)
CREATE POLICY "biolinks_public_read" ON public.biolinks
    FOR SELECT USING (true);

-- Authenticated users can manage (for admin dashboard)
CREATE POLICY "biolinks_auth_manage" ON public.biolinks
    FOR ALL USING (auth.role() = 'authenticated');

-- Bio Link Settings — profile info (single row)
CREATE TABLE IF NOT EXISTS public.biolink_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_name VARCHAR(100) DEFAULT 'Bina Project',
    tagline VARCHAR(200) DEFAULT 'Jasa Konstruksi & Interior Terpercaya di Malang',
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.biolink_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "biolink_settings_public_read" ON public.biolink_settings
    FOR SELECT USING (true);

CREATE POLICY "biolink_settings_auth_manage" ON public.biolink_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings row
INSERT INTO public.biolink_settings (profile_name, tagline)
VALUES ('Bina Project', 'Jasa Konstruksi & Interior Terpercaya di Malang')
ON CONFLICT DO NOTHING;

-- RPC function to increment click count atomically
CREATE OR REPLACE FUNCTION public.increment_biolink_click(link_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.biolinks
    SET click_count = click_count + 1,
        updated_at = now()
    WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- [ ] **Step 2: Run migration in Supabase**

Run the SQL above in the Supabase SQL Editor (Dashboard → SQL Editor → New Query → Paste → Run).

- [ ] **Step 3: Verify tables exist**

Run in Supabase SQL Editor:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('biolinks', 'biolink_settings');
```
Expected: 2 rows returned.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260914_biolinks.sql
git commit -m "feat(db): add biolinks and biolink_settings tables with RLS"
```

---

### Task 2: Scaffold Bio Link Vite App

**Files:**
- Create: `apps/biolink/package.json`
- Create: `apps/biolink/tsconfig.json`
- Create: `apps/biolink/vite.config.ts`
- Create: `apps/biolink/index.html`
- Create: `apps/biolink/src/main.tsx`
- Create: `apps/biolink/src/App.tsx` (minimal placeholder)
- Create: `apps/biolink/src/lib/supabase.ts`
- Create: `apps/biolink/src/index.css`
- Modify: `package.json` (root — add `dev:bio` and `build:bio` scripts)

**Interfaces:**
- Produces: A runnable Vite React app at `http://localhost:3001` that renders "Bio Link" text. `supabase` client exported from `apps/biolink/src/lib/supabase.ts`.

- [ ] **Step 1: Create `apps/biolink/package.json`**

```json
{
  "name": "binaproject-biolink",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.48.1",
    "lucide-react": "^1.44.0",
    "ogl": "^1.0.8",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.31",
    "@types/react-dom": "^18.3.7",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.9.3",
    "vite": "^6.1.0"
  }
}
```

- [ ] **Step 2: Create `apps/biolink/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create `apps/biolink/vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    port: 3001,
  },
});
```

- [ ] **Step 4: Create `apps/biolink/index.html`**

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0E1E38" />
    <title>Bina Project — Link</title>
    <meta name="description" content="Semua link penting Bina Project Construction & Interior di satu tempat." />
    
    <!-- OG Tags -->
    <meta property="og:title" content="Bina Project — Link" />
    <meta property="og:description" content="Semua link penting Bina Project Construction & Interior di satu tempat." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://bio.binaproject.com" />
    <meta property="og:image" content="https://binaproject.com/assets/img/og-image.png" />
    <meta property="og:site_name" content="Bina Project" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Bina Project — Link" />
    <meta name="twitter:description" content="Semua link penting Bina Project Construction & Interior di satu tempat." />
    <meta name="twitter:image" content="https://binaproject.com/assets/img/og-image.png" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://binaproject.com/favicon.png" />

    <!-- Google Font: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `apps/biolink/src/main.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 6: Create `apps/biolink/src/lib/supabase.ts`**

```typescript
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
```

- [ ] **Step 7: Create `apps/biolink/src/index.css`**

```css
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --navy-900: #0E1E38;
  --navy-800: #152B49;
  --navy-700: #1E3A5F;
  --navy-600: #22416D;
  --gold-500: #F68A0A;
  --gold-400: #F89B2E;
  --gold-300: #FABC6A;
  --white: #FFFFFF;
  --white-90: rgba(255, 255, 255, 0.9);
  --white-70: rgba(255, 255, 255, 0.7);
  --white-50: rgba(255, 255, 255, 0.5);
  --white-20: rgba(255, 255, 255, 0.2);
  --white-10: rgba(255, 255, 255, 0.1);
}

html, body, #root {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: var(--navy-900);
  color: var(--white);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--white-20);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--white-50);
}
```

- [ ] **Step 8: Create minimal `apps/biolink/src/App.tsx`**

```tsx
export function App() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Bio Link — Scaffold OK</h1>
    </div>
  );
}
```

- [ ] **Step 9: Create `apps/biolink/.env`**

Copy `.env` values from the dashboard app:
```
VITE_SUPABASE_URL=<same value as apps/dashboard/.env>
VITE_SUPABASE_ANON_KEY=<same value as apps/dashboard/.env>
```

- [ ] **Step 10: Add root scripts**

In root `package.json`, add to `"scripts"`:
```json
"dev:bio": "npm --prefix apps/biolink run dev",
"build:bio": "npm --prefix apps/biolink run build",
"typecheck:bio": "npm --prefix apps/biolink run typecheck"
```

- [ ] **Step 11: Install dependencies and verify**

```bash
cd apps/biolink && npm install
cd ../.. && npm run dev:bio
```

Expected: App running at `http://localhost:3001` showing "Bio Link — Scaffold OK".

- [ ] **Step 12: Commit**

```bash
git add apps/biolink/ package.json
git commit -m "feat(biolink): scaffold Vite React app for bio.binaproject.com"
```

---

### Task 3: Particles Background Component

**Files:**
- Create: `apps/biolink/src/components/Particles.tsx`

**Interfaces:**
- Consumes: `ogl` package (installed in Task 2).
- Produces: `<Particles />` React component that renders a fullscreen WebGL particle animation. Props: `particleCount`, `particleSpread`, `speed`, `particleColors`, `moveParticlesOnHover`, `particleHoverFactor`, `alphaParticles`, `particleBaseSize`, `sizeRandomness`, `cameraDistance`, `disableRotation`, `className`.

- [ ] **Step 1: Create Particles component**

This component is adapted from React Bits' `Particles` component. It uses ogl WebGL library to render animated 3D particles as GL_POINTS.

```tsx
import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const int = parseInt(hex.slice(0, 6), 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    vRandom = random;
    vColor = color;
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = uSizeRandomness == 0.0
      ? uBaseSize
      : (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    if (uAlphaParticles < 0.5) {
      if (d > 0.5) discard;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

export function Particles({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors = ['#ffffff', '#F68A0A', '#87CEEB'],
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  className = '',
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.inset = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.pointerEvents = 'none';
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 15, near: 0.01, far: 100 });
    camera.position.z = cameraDistance;

    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    resize();
    window.addEventListener('resize', resize);

    const count = particleCount;
    const position = new Float32Array(count * 3);
    const random = new Float32Array(count * 4);
    const color = new Float32Array(count * 3);
    const colors = particleColors.map(hexToRgb);

    for (let i = 0; i < count; i++) {
      position.set([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], i * 3);
      random.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const c = colors[Math.floor(Math.random() * colors.length)];
      color.set(c, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: position },
      random: { size: 4, data: random },
      color: { size: 3, data: color },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
      },
      transparent: true,
      depthTest: false,
    });

    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (!moveParticlesOnHover) return;
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * particleHoverFactor;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * particleHoverFactor;
    };
    container.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    let time = 0;
    const update = () => {
      animId = requestAnimationFrame(update);
      time += speed * 0.01;
      program.uniforms.uTime.value = time;

      if (!disableRotation) {
        mesh.rotation.x = moveParticlesOnHover ? -mouseY * 0.3 : Math.sin(time * 0.5) * 0.1;
        mesh.rotation.y = moveParticlesOnHover ? mouseX * 0.3 : Math.cos(time * 0.5) * 0.1;
      }

      renderer.render({ scene: mesh, camera });
    };
    update();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [particleCount, particleSpread, speed, particleColors, moveParticlesOnHover, particleHoverFactor, alphaParticles, particleBaseSize, sizeRandomness, cameraDistance, disableRotation]);

  return <div ref={containerRef} className={className} style={{ position: 'relative', width: '100%', height: '100%' }} />;
}
```

- [ ] **Step 2: Verify component renders**

In `App.tsx`, temporarily import and render:
```tsx
import { Particles } from './components/Particles';
export function App() {
  return (
    <div style={{ height: '100vh', background: '#0E1E38' }}>
      <Particles />
    </div>
  );
}
```

Run `npm run dev:bio`, open `http://localhost:3001` — expect white/gold particles floating on dark background.

- [ ] **Step 3: Commit**

```bash
git add apps/biolink/src/components/Particles.tsx
git commit -m "feat(biolink): add Particles WebGL background component"
```

---

### Task 4: Bio Link Public UI Components

**Files:**
- Create: `apps/biolink/src/types.ts`
- Create: `apps/biolink/src/components/LinkButton.tsx`
- Create: `apps/biolink/src/components/SocialBar.tsx`
- Create: `apps/biolink/src/components/BioCard.tsx`

**Interfaces:**
- Consumes: `supabase` client from `apps/biolink/src/lib/supabase.ts`, `Particles` from Task 3.
- Produces: `<BioCard />` (main card component), `<LinkButton />` (individual link), `<SocialBar />` (social icons row). Types: `BioLink`, `BioLinkSettings`.

- [ ] **Step 1: Create `apps/biolink/src/types.ts`**

```typescript
export interface BioLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
  click_count: number;
}

export interface BioLinkSettings {
  id: string;
  profile_name: string;
  tagline: string;
  avatar_url: string | null;
}
```

- [ ] **Step 2: Create `apps/biolink/src/components/LinkButton.tsx`**

```tsx
import * as LucideIcons from 'lucide-react';
import type { BioLink } from '../types';
import { supabase } from '../lib/supabase';

interface LinkButtonProps {
  link: BioLink;
}

function getIcon(iconName: string) {
  const pascalName = iconName
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('') as keyof typeof LucideIcons;
  const Icon = LucideIcons[pascalName];
  if (Icon && typeof Icon === 'function') return Icon as React.FC<{ className?: string }>;
  return LucideIcons.Globe as React.FC<{ className?: string }>;
}

export function LinkButton({ link }: LinkButtonProps) {
  const Icon = getIcon(link.icon);

  const handleClick = () => {
    // Fire-and-forget click tracking
    if (supabase) {
      supabase.rpc('increment_biolink_click', { link_id: link.id }).catch(() => {});
    }
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="link-button"
    >
      <Icon className="link-button-icon" />
      <span className="link-button-text">{link.title}</span>
    </a>
  );
}
```

Add to `apps/biolink/src/index.css`:
```css
/* Link Button */
.link-button {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 20px;
  border-radius: 14px;
  background: var(--white-10);
  backdrop-filter: blur(8px);
  border: 1px solid var(--white-20);
  color: var(--white);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.link-button:hover {
  background: var(--white-20);
  border-color: var(--gold-500);
  box-shadow: 0 0 20px rgba(246, 138, 10, 0.25), 0 0 40px rgba(246, 138, 10, 0.1);
  transform: translateY(-2px);
}

.link-button:active {
  transform: translateY(0);
}

.link-button-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--gold-500);
}

.link-button-text {
  flex: 1;
  text-align: left;
}
```

- [ ] **Step 3: Create `apps/biolink/src/components/SocialBar.tsx`**

```tsx
const SOCIALS = [
  { platform: 'Instagram', url: 'https://www.instagram.com/binaproject.id', icon: 'instagram' },
  { platform: 'TikTok', url: 'https://www.tiktok.com/@binaproject.id', icon: 'tiktok' },
  { platform: 'YouTube', url: 'https://www.youtube.com/@binaproject.id', icon: 'youtube' },
  { platform: 'WhatsApp', url: 'https://wa.me/6281335335304', icon: 'whatsapp' },
  { platform: 'Google', url: 'https://share.google/bF9i03JuwxrcOQo7y', icon: 'google' },
];

function SocialIcon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    instagram: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    tiktok: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
    youtube: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    whatsapp: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    google: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
      </svg>
    ),
  };
  return icons[name] || null;
}

export function SocialBar() {
  return (
    <div className="social-bar">
      {SOCIALS.map(s => (
        <a
          key={s.platform}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={s.platform}
        >
          <SocialIcon name={s.icon} className="social-icon" />
        </a>
      ))}
    </div>
  );
}
```

Add to `apps/biolink/src/index.css`:
```css
/* Social Bar */
.social-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 16px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--white-10);
  border: 1px solid var(--white-10);
  color: var(--white-70);
  transition: all 0.3s ease;
}

.social-link:hover {
  background: var(--white-20);
  color: var(--gold-500);
  border-color: var(--gold-500);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(246, 138, 10, 0.2);
}

.social-icon {
  width: 18px;
  height: 18px;
}
```

- [ ] **Step 4: Create `apps/biolink/src/components/BioCard.tsx`**

```tsx
import type { BioLink, BioLinkSettings } from '../types';
import { LinkButton } from './LinkButton';
import { SocialBar } from './SocialBar';

interface BioCardProps {
  settings: BioLinkSettings | null;
  links: BioLink[];
}

export function BioCard({ settings, links }: BioCardProps) {
  const logoUrl = 'https://binaproject.com/assets/img/logo-light.webp';
  const activeLinks = links.filter(l => l.is_active).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="bio-card">
      {/* Logo */}
      <div className="bio-logo-wrap">
        <img
          src={logoUrl}
          alt="Bina Project"
          className="bio-logo"
          width={72}
          height={72}
        />
      </div>

      {/* Profile Name */}
      <h1 className="bio-name">{settings?.profile_name || 'Bina Project'}</h1>

      {/* Tagline */}
      <p className="bio-tagline">
        {settings?.tagline || 'Jasa Konstruksi & Interior Terpercaya di Malang'}
      </p>

      {/* Links */}
      <div className="bio-links">
        {activeLinks.map(link => (
          <LinkButton key={link.id} link={link} />
        ))}
        {activeLinks.length === 0 && (
          <p className="bio-empty">Belum ada link yang ditampilkan.</p>
        )}
      </div>

      {/* Social Icons */}
      <SocialBar />

      {/* Footer */}
      <p className="bio-footer">
        © {new Date().getFullYear()} Bina Project Construction & Interior
      </p>
    </div>
  );
}
```

Add to `apps/biolink/src/index.css`:
```css
/* Bio Card */
.bio-card {
  position: relative;
  z-index: 10;
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  min-height: 100dvh;
}

.bio-logo-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid var(--gold-500);
  padding: 4px;
  margin-bottom: 16px;
  background: var(--white-10);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInDown 0.6s ease-out;
}

.bio-logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  border-radius: 50%;
}

.bio-name {
  font-size: 22px;
  font-weight: 800;
  color: var(--white);
  text-align: center;
  margin-bottom: 4px;
  animation: fadeInDown 0.6s ease-out 0.1s both;
}

.bio-tagline {
  font-size: 14px;
  color: var(--white-70);
  text-align: center;
  margin-bottom: 28px;
  max-width: 300px;
  line-height: 1.5;
  animation: fadeInDown 0.6s ease-out 0.2s both;
}

.bio-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.bio-empty {
  text-align: center;
  color: var(--white-50);
  font-size: 14px;
  padding: 24px 0;
}

.bio-footer {
  margin-top: auto;
  padding-top: 32px;
  font-size: 11px;
  color: var(--white-50);
  text-align: center;
}

/* Animations */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/biolink/src/types.ts apps/biolink/src/components/ apps/biolink/src/index.css
git commit -m "feat(biolink): add BioCard, LinkButton, SocialBar UI components"
```

---

### Task 5: Wire Up Bio Link App (Supabase Data Fetching + Final Layout)

**Files:**
- Modify: `apps/biolink/src/App.tsx`

**Interfaces:**
- Consumes: `supabase` from `lib/supabase.ts`, `Particles` from Task 3, `BioCard` from Task 4, types from `types.ts`.
- Produces: Final public-facing Bio Link page, ready for deployment.

- [ ] **Step 1: Update `apps/biolink/src/App.tsx`**

```tsx
import { useState, useEffect } from 'react';
import { Particles } from './components/Particles';
import { BioCard } from './components/BioCard';
import { supabase } from './lib/supabase';
import type { BioLink, BioLinkSettings } from './types';

export function App() {
  const [links, setLinks] = useState<BioLink[]>([]);
  const [settings, setSettings] = useState<BioLinkSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const [linksRes, settingsRes] = await Promise.all([
          supabase
            .from('biolinks')
            .select('id, title, url, icon, is_active, sort_order, click_count')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
          supabase
            .from('biolink_settings')
            .select('id, profile_name, tagline, avatar_url')
            .limit(1)
            .single(),
        ]);

        if (linksRes.data) setLinks(linksRes.data);
        if (settingsRes.data) setSettings(settingsRes.data);
      } catch (err) {
        console.error('Failed to fetch bio link data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="app-root">
      <div className="particles-bg">
        <Particles
          particleCount={200}
          particleSpread={10}
          speed={0.08}
          particleColors={['#ffffff', '#F68A0A', '#87CEEB']}
          moveParticlesOnHover={true}
          particleHoverFactor={1}
          alphaParticles={true}
          particleBaseSize={80}
          sizeRandomness={1}
          cameraDistance={25}
        />
      </div>
      <div className="content-scroll">
        <BioCard settings={settings} links={links} />
      </div>
    </div>
  );
}
```

Add to `apps/biolink/src/index.css`:
```css
/* App Root Layout */
.app-root {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: linear-gradient(180deg, var(--navy-900) 0%, #070D18 100%);
}

.particles-bg {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.content-scroll {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

/* Loading Screen */
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--navy-900);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--white-20);
  border-top-color: var(--gold-500);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

- [ ] **Step 2: Run and verify visually**

Run `npm run dev:bio`, open `http://localhost:3001`:
- Expect: Particles background animating behind the bio card.
- Expect: Logo, profile name, tagline, empty state message, social icons.

- [ ] **Step 3: Verify TypeScript**

```bash
cd apps/biolink && npx tsc --noEmit
```
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add apps/biolink/src/App.tsx apps/biolink/src/index.css
git commit -m "feat(biolink): wire up Supabase data fetching and final layout"
```

---

### Task 6: Dashboard Admin — BioLinkEditor Page

**Files:**
- Create: `apps/dashboard/src/pages/BioLinkEditor.tsx`
- Modify: `apps/dashboard/src/components/Sidebar.tsx` (add `'biolink'` to `TabType`, add menu item)
- Modify: `apps/dashboard/src/App.tsx` (add route, import, title)

**Interfaces:**
- Consumes: `supabase` from `apps/dashboard/src/lib/supabase.ts`, existing UI components (`Button`, `Input`, `Card`).
- Produces: `<BioLinkEditor />` page component with full CRUD (add, edit, delete, reorder, toggle active/inactive).

- [ ] **Step 1: Create `apps/dashboard/src/pages/BioLinkEditor.tsx`**

```tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Trash2, GripVertical, ExternalLink, Eye, EyeOff,
  Save, BarChart3, Link2, Edit2, Check, X, RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';

interface BioLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
  click_count: number;
}

interface BioSettings {
  id: string;
  profile_name: string;
  tagline: string;
  avatar_url: string | null;
}

export const BioLinkEditor: React.FC = () => {
  const [links, setLinks] = useState<BioLink[]>([]);
  const [settings, setSettings] = useState<BioSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Add new link form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIcon, setNewIcon] = useState('globe');

  // Inline edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editIcon, setEditIcon] = useState('');

  // Settings edit
  const [editProfileName, setEditProfileName] = useState('');
  const [editTagline, setEditTagline] = useState('');

  // Drag state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!supabase) return;
      const [linksRes, settingsRes] = await Promise.all([
        supabase.from('biolinks').select('*').order('sort_order', { ascending: true }),
        supabase.from('biolink_settings').select('*').limit(1).single(),
      ]);
      if (linksRes.data) setLinks(linksRes.data);
      if (settingsRes.data) {
        setSettings(settingsRes.data);
        setEditProfileName(settingsRes.data.profile_name);
        setEditTagline(settingsRes.data.tagline);
      }
    } catch (err) {
      console.error('Failed to fetch biolinks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddLink = async () => {
    if (!newTitle.trim() || !newUrl.trim() || !supabase) return;
    setSaving(true);
    try {
      const maxOrder = links.reduce((max, l) => Math.max(max, l.sort_order), -1);
      const { error } = await supabase.from('biolinks').insert([{
        title: newTitle.trim(),
        url: newUrl.trim(),
        icon: newIcon.trim() || 'globe',
        sort_order: maxOrder + 1,
      }]);
      if (error) throw error;
      setNewTitle('');
      setNewUrl('');
      setNewIcon('globe');
      setShowAddForm(false);
      await fetchData();
    } catch (err) {
      console.error('Failed to add link:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!supabase || !window.confirm('Hapus link ini?')) return;
    try {
      await supabase.from('biolinks').delete().eq('id', id);
      await fetchData();
    } catch (err) {
      console.error('Failed to delete link:', err);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    if (!supabase) return;
    try {
      await supabase.from('biolinks').update({ is_active: !currentActive }).eq('id', id);
      setLinks(prev => prev.map(l => l.id === id ? { ...l, is_active: !currentActive } : l));
    } catch (err) {
      console.error('Failed to toggle link:', err);
    }
  };

  const handleStartEdit = (link: BioLink) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditIcon(link.icon);
  };

  const handleSaveEdit = async () => {
    if (!supabase || !editingId || !editTitle.trim() || !editUrl.trim()) return;
    setSaving(true);
    try {
      await supabase.from('biolinks').update({
        title: editTitle.trim(),
        url: editUrl.trim(),
        icon: editIcon.trim() || 'globe',
        updated_at: new Date().toISOString(),
      }).eq('id', editingId);
      setEditingId(null);
      await fetchData();
    } catch (err) {
      console.error('Failed to update link:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null || !supabase) return;
    const reordered = [...links];
    const [draggedItem] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, draggedItem);

    // Update sort_order locally
    const updated = reordered.map((link, i) => ({ ...link, sort_order: i }));
    setLinks(updated);

    dragItem.current = null;
    dragOverItem.current = null;

    // Persist to database
    try {
      const updates = updated.map(l =>
        supabase!.from('biolinks').update({ sort_order: l.sort_order }).eq('id', l.id)
      );
      await Promise.all(updates);
    } catch (err) {
      console.error('Failed to reorder:', err);
      await fetchData(); // rollback
    }
  };

  const handleSaveSettings = async () => {
    if (!supabase || !settings) return;
    setSaving(true);
    try {
      await supabase.from('biolink_settings').update({
        profile_name: editProfileName.trim(),
        tagline: editTagline.trim(),
        updated_at: new Date().toISOString(),
      }).eq('id', settings.id);
      await fetchData();
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const totalClicks = links.reduce((sum, l) => sum + (l.click_count || 0), 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Bio Link</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
            Kelola link bio di <a href="https://bio.binaproject.com" target="_blank" rel="noopener noreferrer" style={{ color: '#22416D', textDecoration: 'underline' }}>bio.binaproject.com</a>
          </p>
        </div>
        <a
          href="https://bio.binaproject.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#22416D', fontWeight: 600 }}
        >
          <ExternalLink className="w-4 h-4" />
          Lihat Bio
        </a>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <Card style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{links.length}</div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Link</div>
        </Card>
        <Card style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#16a34a' }}>{links.filter(l => l.is_active).length}</div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Link Aktif</div>
        </Card>
        <Card style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#F68A0A' }}>{totalClicks}</div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Klik</div>
        </Card>
      </div>

      {/* Profile Settings */}
      <Card style={{ padding: 20, marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart3 className="w-4 h-4 text-slate-500" />
          Pengaturan Profil
        </h2>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
              Nama Profil
            </label>
            <Input
              value={editProfileName}
              onChange={e => setEditProfileName(e.target.value)}
              placeholder="Bina Project"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
              Tagline
            </label>
            <Input
              value={editTagline}
              onChange={e => setEditTagline(e.target.value)}
              placeholder="Jasa Konstruksi & Interior..."
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleSaveSettings} disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'Simpan Profil'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Links List */}
      <Card style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link2 className="w-4 h-4 text-slate-500" />
            Daftar Link
          </h2>
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
            <Plus className="w-4 h-4" />
            Tambah Link
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div style={{ padding: 16, marginBottom: 16, borderRadius: 12, background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gap: 10 }}>
              <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Judul (mis. Website Resmi)" />
              <Input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="URL (mis. https://binaproject.com)" />
              <Input value={newIcon} onChange={e => setNewIcon(e.target.value)} placeholder="Icon Lucide (mis. globe, phone, shopping-bag)" />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button onClick={() => { setShowAddForm(false); setNewTitle(''); setNewUrl(''); setNewIcon('globe'); }} style={{ background: '#e2e8f0', color: '#475569' }}>
                  Batal
                </Button>
                <Button onClick={handleAddLink} disabled={saving || !newTitle.trim() || !newUrl.trim()}>
                  <Plus className="w-4 h-4" />
                  {saving ? 'Menyimpan...' : 'Tambah'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {links.map((link, index) => (
            <div
              key={link.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={e => e.preventDefault()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                background: link.is_active ? '#fff' : '#f8fafc',
                opacity: link.is_active ? 1 : 0.6,
                cursor: 'grab',
                transition: 'all 0.2s ease',
              }}
            >
              <GripVertical className="w-4 h-4 text-slate-300 shrink-0" style={{ cursor: 'grab' }} />

              {editingId === link.id ? (
                <div style={{ flex: 1, display: 'grid', gap: 6 }}>
                  <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Judul" />
                  <Input value={editUrl} onChange={e => setEditUrl(e.target.value)} placeholder="URL" />
                  <Input value={editIcon} onChange={e => setEditIcon(e.target.value)} placeholder="Icon" />
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditingId(null)} style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                      <X className="w-3 h-3" /> Batal
                    </button>
                    <button onClick={handleSaveEdit} style={{ padding: '4px 10px', borderRadius: 8, border: 'none', background: '#22416D', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                      <Check className="w-3 h-3" /> Simpan
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.url}</div>
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    {link.click_count} klik
                  </span>
                  <button onClick={() => handleToggleActive(link.id, link.is_active)} title={link.is_active ? 'Nonaktifkan' : 'Aktifkan'} style={{ padding: 6, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: link.is_active ? '#16a34a' : '#94a3b8' }}>
                    {link.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleStartEdit(link)} title="Edit" style={{ padding: 6, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteLink(link.id)} title="Hapus" style={{ padding: 6, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))}

          {links.length === 0 && !showAddForm && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8', fontSize: 14 }}>
              Belum ada link. Klik "Tambah Link" untuk memulai.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
```

- [ ] **Step 2: Update Sidebar — add `'biolink'` to `TabType`**

In `apps/dashboard/src/components/Sidebar.tsx`, change the `TabType` union to include `'biolink'`:

```typescript
export type TabType =
  | 'overview'
  | 'portfolio'
  | 'articles'
  | 'redirects'
  | 'settings'
  | 'portfolio-new'
  | 'article-new'
  | 'biolink';
```

Add a navigation button for Bio Link in the Sidebar navigation section (after Redirects/Pengalihan). Add import for `Link2` from lucide-react and add a new button:

```tsx
{/* Bio Link */}
<button
  type="button"
  onClick={() => handleSelect('biolink')}
  className={`w-full flex items-center justify-between gap-3 rounded-xl px-3.5 h-11 text-sm font-semibold transition-colors ${
    isTabActive('biolink')
      ? 'bg-[#22416D] text-white shadow-xs'
      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
  }`}
>
  <div className="flex items-center gap-3 min-w-0">
    <Link2 className={`w-5 h-5 shrink-0 ${isTabActive('biolink') ? 'text-white' : 'text-slate-500'}`} />
    <span className="truncate">Bio Link</span>
  </div>
</button>
```

- [ ] **Step 3: Update App.tsx — add route and import**

In `apps/dashboard/src/App.tsx`:

1. Add import: `import { BioLinkEditor } from './pages/BioLinkEditor';`

2. Update `validTabs` array to include `'biolink'`:
```typescript
const validTabs: TabType[] = [
  'overview', 'portfolio', 'portfolio-new', 'articles', 'article-new',
  'redirects', 'settings', 'biolink',
];
```

3. Add case in `renderContent()` switch before `case 'settings'`:
```tsx
case 'biolink':
  return <BioLinkEditor />;
```

4. Add title in the `titles` Record:
```typescript
'biolink': 'Bio Link - Bina Project Studio',
```

- [ ] **Step 4: Verify TypeScript**

```bash
npm run typecheck:dash
```
Expected: 0 errors.

- [ ] **Step 5: Verify visually**

Open `http://localhost:3000#biolink` in the dashboard — expect Bio Link editor page with profile settings form, stats cards, and add link form.

- [ ] **Step 6: Commit**

```bash
git add apps/dashboard/src/pages/BioLinkEditor.tsx apps/dashboard/src/components/Sidebar.tsx apps/dashboard/src/App.tsx
git commit -m "feat(dashboard): add BioLinkEditor admin page with CRUD and drag-reorder"
```

---

### Task 7: Build Verification & Deployment Config

**Files:**
- Create: `apps/biolink/.gitignore`
- Verify: Build passes for both apps

**Interfaces:**
- Consumes: All code from Tasks 1-6.
- Produces: Production-ready build artifacts, deployment configuration notes.

- [ ] **Step 1: Create `apps/biolink/.gitignore`**

```
node_modules
dist
.env
```

- [ ] **Step 2: Build biolink app**

```bash
cd apps/biolink && npm run build
```
Expected: Build completes, `dist/` directory created with `index.html` + JS/CSS assets.

- [ ] **Step 3: Build dashboard app**

```bash
cd ../.. && npm run build:dash
```
Expected: Build completes with 0 errors.

- [ ] **Step 4: Verify main Astro site still builds**

```bash
npm run build
```
Expected: Build completes with 0 errors.

- [ ] **Step 5: Commit all**

```bash
git add .
git commit -m "feat(biolink): complete bio link system - public page + admin editor"
```

- [ ] **Step 6: Push to remote**

```bash
git push origin main
```

> **Deployment Notes for Cloudflare Pages:**
> 
> 1. Create a new Cloudflare Pages project for `bio.binaproject.com`
> 2. Build command: `cd apps/biolink && npm install && npm run build`
> 3. Build output directory: `apps/biolink/dist`
> 4. Environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
> 5. Custom domain: `bio.binaproject.com`
