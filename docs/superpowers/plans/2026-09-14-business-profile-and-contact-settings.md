# Business Profile & Contact Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a dedicated "Profil & Kontak Bisnis" management module in the Admin Dashboard (`apps/dashboard`) with real-time Live Preview and 1-click Cloudflare publication, synced dynamically into the main Astro website with fallback.

**Architecture:** 
- Single-row configuration in Supabase (`public.site_settings`, keyed by `id = 'general'`) with RLS (public read, authenticated write).
- Admin dashboard tab (`site-settings`) in `Sidebar.tsx` featuring a dual-column layout: comprehensive form controls on the left and a live interactive business card & WhatsApp test button on the right.
- Astro SSG integration via `src/lib/siteSettingsService.ts` that merges database configurations over `src/config/site.ts` at build time with 100% resilient fallback.

**Tech Stack:** React 18, Tailwind CSS, Lucide Icons, Supabase Database & Auth, Astro 5, TypeScript.

---

## Global Constraints
- Do not break existing static builds: if Supabase is offline or `site_settings` is unpopulated, fallback completely to `src/config/site.ts`.
- Maintain strict rate-limiting and feedback when triggering Cloudflare deployments.
- No TypeScript or lint regressions in either `apps/dashboard` or main Astro workspace.

---

### Task 1: Supabase Database Migration & Types

**Files:**
- Create: `supabase/migrations/20260914_site_settings.sql`
- Create/Modify: `apps/dashboard/src/types/settings.ts`

**Interfaces:**
- Produces: `SiteSettings` interface:
  ```ts
  export interface SiteSettings {
    id: string;
    phone_display: string;
    phone_tel: string;
    whatsapp_number: string;
    whatsapp_url: string;
    whatsapp_default_message: string;
    email: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    google_maps_url: string;
    google_maps_embed_url: string;
    opening_hours: string;
    opening_hours_detail: string;
    instagram_url: string;
    tiktok_url: string;
    youtube_url: string;
    google_business_url: string;
    updated_at?: string;
  }
  ```

- [ ] **Step 1: Create the SQL migration file**
Write `supabase/migrations/20260914_site_settings.sql` with table definition, RLS policies, and seed row:
```sql
CREATE TABLE IF NOT EXISTS public.site_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'general',
    phone_display VARCHAR(50) DEFAULT '+62 81-335-335-304',
    phone_tel VARCHAR(50) DEFAULT 'tel:+6281335335304',
    whatsapp_number VARCHAR(50) DEFAULT '6281335335304',
    whatsapp_url TEXT DEFAULT 'https://wa.me/6281335335304',
    whatsapp_default_message TEXT DEFAULT 'Halo Bina Project, saya ingin konsultasi rencana proyek konstruksi/interior dan estimasi RAB gratis.',
    email VARCHAR(100) DEFAULT 'binaproject.info@gmail.com',
    address TEXT DEFAULT 'Jl. Watumujur II No.6, Kota Malang',
    city VARCHAR(100) DEFAULT 'Kota Malang',
    province VARCHAR(100) DEFAULT 'Jawa Timur',
    postal_code VARCHAR(20) DEFAULT '65145',
    google_maps_url TEXT DEFAULT 'https://maps.app.goo.gl/3E54uS2WDg4EPDgL6',
    google_maps_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.4746073810625!2d112.60884237591145!3d-7.94980687920362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7883eadea01223%3A0x3bf7f69bb74761e0!2sBina%20Project%20%7C%20Jasa%20Konstruksi%20dan%20Interior!5e0!3m2!1sid!2sid!4v1737646658910!5m2!1sid!2sid',
    opening_hours TEXT DEFAULT 'Senin - Sabtu: 08:00 - 16:00 WIB',
    opening_hours_detail TEXT DEFAULT 'Senin - Sabtu: 08:00 - 16:00 WIB | Minggu / Libur: Khusus Janji Temu',
    instagram_url TEXT DEFAULT 'https://www.instagram.com/binaproject.id',
    tiktok_url TEXT DEFAULT 'https://www.tiktok.com/@binaproject.id',
    youtube_url TEXT DEFAULT 'https://www.youtube.com/@binaproject.id',
    google_business_url TEXT DEFAULT 'https://share.google/bF9i03JuwxrcOQo7y',
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_public_read" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_auth_manage" ON public.site_settings;

CREATE POLICY "site_settings_public_read" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "site_settings_auth_manage" ON public.site_settings
    FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO public.site_settings (id)
VALUES ('general')
ON CONFLICT (id) DO NOTHING;
```

- [ ] **Step 2: Create TypeScript interfaces for Settings**
Create `apps/dashboard/src/types/settings.ts` exporting `SiteSettings` and default fallback constants.

---

### Task 2: Dashboard Service & Sidebar Navigation

**Files:**
- Create: `apps/dashboard/src/lib/settingsService.ts`
- Modify: `apps/dashboard/src/components/Sidebar.tsx`
- Modify: `apps/dashboard/src/App.tsx`

**Interfaces:**
- Produces:
  - `fetchSiteSettings(): Promise<SiteSettings>`
  - `saveSiteSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; message: string }>`

- [ ] **Step 1: Create `settingsService.ts` in dashboard**
Implement fetch & upsert methods interacting with `public.site_settings` table via Supabase client, falling back gracefully to initial defaults when disconnected.

- [ ] **Step 2: Add `site-settings` to `Sidebar.tsx`**
Add `'site-settings'` to `TabType`. Under "Kelola Konten Website", add a clean navigation button with `Building2` icon:
```tsx
<button
  type="button"
  onClick={() => handleSelect('site-settings')}
  className={`w-full flex items-center justify-between gap-3 rounded-full px-4 h-11 text-sm font-semibold transition-all cursor-pointer ${
    activeTab === 'site-settings'
      ? 'bg-[#22416D] text-white shadow-md shadow-[#22416D]/30 border border-blue-400/30'
      : 'text-slate-300 hover:bg-white/10 hover:text-white'
  }`}
>
  <div className="flex items-center gap-3 min-w-0">
    <Building2 className={`w-5 h-5 shrink-0 ${activeTab === 'site-settings' ? 'text-white' : 'text-blue-300/70'}`} />
    <span className="truncate">Profil & Kontak</span>
  </div>
</button>
```

- [ ] **Step 3: Update `App.tsx` routing & title**
Add route handling for `#site-settings` and render `<BusinessProfileSettings />`.

---

### Task 3: Build `BusinessProfileSettings` Page with Live Preview

**Files:**
- Create: `apps/dashboard/src/pages/BusinessProfileSettings.tsx`

- [ ] **Step 1: Implement the 4-section Form**
  1. **Kontak Utama & WhatsApp**:
     - WhatsApp Number (e.g. `6281335335304`)
     - Default Greeting Message textarea
     - Phone Display (`+62 81-335-335-304`) & Tel (`tel:+6281335335304`)
     - Office Email (`binaproject.info@gmail.com`)
  2. **Alamat Kantor & Google Maps**:
     - Street Address (`Jl. Watumujur II No.6, Kota Malang`)
     - City, Province, Postal Code
     - Google Maps Link & Embed Iframe URL
  3. **Jam Operasional**:
     - Regular hours (`Senin - Sabtu: 08:00 - 16:00 WIB`)
     - Detail / Holiday hours
  4. **Media Sosial Resmi**:
     - Instagram, TikTok, YouTube, Google Business Profile URLs

- [ ] **Step 2: Implement Desktop Live Preview Card**
Build an interactive live preview card on the right-hand column:
- Displays business identity card styling matching the website.
- Live reactive changes as the user types in inputs.
- Active "Coba Link WhatsApp" button that opens `https://wa.me/{number}?text={encoded}` in a new tab so admin can verify before saving.
- Interactive Google Maps embed preview box.

- [ ] **Step 3: Save & 1-Click Cloudflare Deploy Modal/Notification**
When user clicks "Simpan Perubahan":
- Saves to Supabase `site_settings`.
- Displays toast with action button: `[Publikasikan ke Website Sekarang]` which triggers Cloudflare deploy with rate-limit counter feedback.

---

### Task 4: Astro Main Website Dynamic Service & Component Integration

**Files:**
- Create: `src/lib/siteSettingsService.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/utils/whatsapp.ts`

- [ ] **Step 1: Create `siteSettingsService.ts` in main Astro app**
Implement cached build-time fetch from Supabase `site_settings` with complete fallback to `siteConfig` from `src/config/site.ts`.

- [ ] **Step 2: Update `whatsapp.ts`**
Allow passing custom WhatsApp numbers or reading dynamic settings while maintaining backwards-compatibility with all existing calls.

- [ ] **Step 3: Connect `Footer.astro`, `Header.astro`, & `BaseLayout.astro`**
Integrate `getSiteSettings()` so address, phone numbers, WhatsApp, opening hours, and social media links reflect the dynamic values from the database.

---

### Task 5: End-to-End Verification & Quality Checks

**Files:**
- Verification only

- [ ] **Step 1: Typecheck Dashboard**
Run `npm run --prefix apps/dashboard typecheck` and verify 0 errors.

- [ ] **Step 2: Astro Check**
Run `npx astro check` and verify 0 errors.

- [ ] **Step 3: Static Build Verification**
Run `npm run build` to confirm all 25+ pages generate smoothly without broken imports or runtime exceptions.
