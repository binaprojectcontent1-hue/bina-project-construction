# Job Card Modern Bento Glassmorphic Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `JobCard.astro` into a Modern Bento Glassmorphic card featuring a 1:1 edge-to-edge media panel, floating glass badges, live recruitment pulse indicator, and dynamic hover effects to maximize candidate engagement.

**Architecture:** Refactor the Astro component `JobCard.astro` to adopt an ultra-clean horizontal bento card layout on desktop (`sm:flex-row`) and stacked layout on mobile (`flex-col`). Implement frosted glass floating badges using Tailwind CSS utility classes (`backdrop-blur-md`, semi-transparent borders and backgrounds), high-contrast architectural typography, and responsive micro-interactions.

**Tech Stack:** Astro v5, Tailwind CSS v4, TypeScript, Lucide SVG inline icons.

**Spec:** `docs/superpowers/specs/2026-09-27-job-card-bento-redesign-spec.md`

## Global Constraints
- Strictly preserve the 1:1 aspect ratio (`aspect-square`) for the thumbnail image container.
- Maintain existing props interface (`slug`, `title`, `department`, `jobType`, `workplaceType`, `location`, `experienceLevel`, `thumbnailUrl`, `deadline`, `salaryRange`, `showSalary`).
- Ensure full semantic anchor link wrapping the card pointing to `/loker/${slug}`.
- Zero TypeScript diagnostics errors or warnings on `astro check`.

---

### Task 1: Redesign `JobCard.astro` to Modern Bento Glassmorphic Layout

**Files:**
- Modify: `apps/career/src/components/JobCard.astro:1-150`

**Interfaces:**
- Consumes: `Props` interface with job metadata and optional `thumbnailUrl`.
- Produces: Enhanced HTML markup with bento container, 1:1 media panel, floating glass tags, and interactive action footer.

- [ ] **Step 1: Update `JobCard.astro` implementation**

Replace the template in `apps/career/src/components/JobCard.astro` with the complete Modern Bento Glassmorphic component:

```astro
---
interface Props {
  slug: string;
  title: string;
  department: string;
  jobType: string;
  workplaceType: string;
  location: string;
  experienceLevel: string;
  thumbnailUrl?: string | null;
  deadline?: string | null;
  salaryRange?: string | null;
  showSalary?: boolean;
}

const {
  slug,
  title,
  department,
  jobType,
  workplaceType,
  location,
  experienceLevel,
  thumbnailUrl,
  deadline,
  salaryRange,
  showSalary,
} = Astro.props;

// Curated high-res architectural & construction photography per department
const defaultThumbnails: Record<string, string> = {
  'Arsitektur & Desain': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
  'Konstruksi & Lapangan': 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?q=80&w=800&auto=format&fit=crop',
  'Estimator & RAB': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
  'Marketing & Finance': 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
  'Magang': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
};

const thumbnail = thumbnailUrl?.trim() || defaultThumbnails[department] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop';

const deptDotColors: Record<string, string> = {
  'Arsitektur & Desain': 'bg-blue-400',
  'Konstruksi & Lapangan': 'bg-emerald-400',
  'Estimator & RAB': 'bg-slate-400',
  'Marketing & Finance': 'bg-purple-400',
  'Magang': 'bg-amber-400',
};

const dotColor = deptDotColors[department] || 'bg-blue-400';

const deadlineDate = deadline ? new Date(deadline) : null;
const isExpiringSoon = deadlineDate && (deadlineDate.getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000;
---

<a
  href={`/loker/${slug}`}
  class="bg-white rounded-3xl overflow-hidden flex flex-col sm:flex-row h-full group relative text-[#17202A] no-underline border border-slate-200/80 shadow-[0_4px_20px_rgba(13,25,43,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(34,65,109,0.18)] hover:border-[#22416D]/40 hover:-translate-y-1.5 transition-all duration-400 ease-out"
>
  <!-- Left Panel: 1:1 Edge-to-Edge Media Panel -->
  <div class="relative w-full sm:w-56 lg:w-60 aspect-square shrink-0 overflow-hidden bg-slate-950">
    <img
      src={thumbnail}
      alt={title}
      loading="lazy"
      class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
    />
    
    <!-- Multi-layer cinematic vignette overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-950/20 pointer-events-none"></div>

    <!-- Floating Glassmorphic Department Tag (Top-Left) -->
    <div class="absolute top-3.5 left-3.5 z-10">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-technical font-semibold backdrop-blur-md bg-white/20 border border-white/30 text-white shadow-sm">
        <span class={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
        <span>{department}</span>
      </span>
    </div>

    <!-- Live Status Indicator (Top-Right) -->
    <div class="absolute top-3.5 right-3.5 z-10">
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-technical font-medium backdrop-blur-md bg-slate-950/50 border border-white/15 text-white/95 shadow-sm">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Merekrut</span>
      </span>
    </div>

    <!-- Floating Location Tag (Bottom-Left) -->
    <div class="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
      <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md bg-slate-950/60 border border-white/10 text-white/95 text-xs font-technical">
        <svg class="w-3.5 h-3.5 text-[#84ACDF] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="truncate max-w-[130px] sm:max-w-[140px]">{location}</span>
      </div>

      <span class="text-[11px] font-technical font-medium text-white/80 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
        {jobType}
      </span>
    </div>
  </div>

  <!-- Right Panel: Bento Content & Actions -->
  <div class="p-6 sm:p-7 flex-1 flex flex-col justify-between min-w-0 bg-white group-hover:bg-gradient-to-br group-hover:from-white group-hover:via-white group-hover:to-slate-50/70 transition-colors duration-400">
    <div>
      <!-- Eyebrow Sub-heading -->
      <div class="flex items-center justify-between gap-2 mb-2.5">
        <span class="text-xs font-technical font-bold uppercase tracking-widest text-[#22416D]">
          {department}
        </span>
        <span class="text-xs font-technical text-slate-400">
          {workplaceType}
        </span>
      </div>

      <!-- Job Title -->
      <h3 class="text-xl sm:text-2xl font-heading font-black text-[#17202A] group-hover:text-[#22416D] transition-colors leading-snug mb-3.5 line-clamp-2">
        {title}
      </h3>

      <!-- Bento Metadata Chips -->
      <div class="flex flex-wrap items-center gap-2 mb-5">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-technical text-slate-600">
          <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Pengalaman: {experienceLevel}</span>
        </div>

        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-technical text-slate-600">
          <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>Sistem: {workplaceType}</span>
        </div>
      </div>
    </div>

    <!-- Bottom Footer Row: Salary, Deadline & Interactive Arrow CTA -->
    <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
      <div>
        {showSalary && salaryRange ? (
          <span class="inline-block text-xs font-technical font-bold text-[#065F46] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#A7F3D0]">
            {salaryRange}
          </span>
        ) : (
          <span class="text-xs font-technical text-slate-500 font-medium">
            Gaji Kompetitif
          </span>
        )}
      </div>

      <div class="flex items-center gap-3">
        {deadlineDate && (
          <span class={`text-xs font-technical ${isExpiringSoon ? 'text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded' : 'text-slate-400'}`}>
            {isExpiringSoon ? 'Segera Berakhir' : `Batas: ${deadlineDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`}
          </span>
        )}

        <!-- Interactive Action Button -->
        <span class="inline-flex items-center gap-2 text-xs font-heading font-bold text-[#22416D] group-hover:text-[#1B365D] transition-colors">
          <span>Lihat Detail</span>
          <span class="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#22416D] group-hover:bg-[#22416D] group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-2xs">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </span>
      </div>
    </div>
  </div>
</a>
```

- [ ] **Step 2: Run type check in `apps/career`**

Run: `npm run typecheck` in directory `d:\binaproject\apps\career`
Expected output: `Result (17 files): 0 errors, 0 warnings, 0 hints`

- [ ] **Step 3: Test rendered HTML on local dev server**

Run: `curl.exe -s http://localhost:4323/ | Select-String -Pattern "Merekrut|scale-108|Lihat Detail" -Context 1,1`
Expected output: Successful match of new bento glassmorphic classes and labels.
