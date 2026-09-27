# Job Card Modern Bento Glassmorphic Redesign Specification

**Date:** 2026-09-27  
**Status:** Approved  
**Scope:** `apps/career/src/components/JobCard.astro`

## 1. Overview & Objective
Redesign the recruitment job card on `karir.binaproject.id` (`apps/career`) into a **Modern Bento Glassmorphic** format. The card must attract high-caliber architecture, construction, engineering, and design talent by projecting high prestige, architectural depth, and crisp visual hierarchy.

## 2. Design System & Visual Requirements

### 2.1 Outer Card Architecture (Bento Container)
- Structure: Rounded bento box with `rounded-3xl` corners.
- Orientation: Horizontal flex on desktop (`sm:flex-row`), vertical on mobile (`flex-col`).
- Border & Lighting:
  - Default: `border border-slate-200/80`
  - Hover: subtle glow `hover:border-[#22416D]/40`
  - Elevation: `shadow-[0_4px_20px_rgba(13,25,43,0.05)] hover:shadow-[0_20px_45px_-12px_rgba(34,65,109,0.18)] hover:-translate-y-1.5`
- Background: Pure white transitioning to subtle cool gradient on hover.

### 2.2 Left Media Panel (1:1 Edge-to-Edge)
- Aspect Ratio: strict 1:1 square (`aspect-square`).
- Desktop width: `sm:w-56 lg:w-60 shrink-0`.
- Image Behavior: `object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-108`.
- Cinematic Overlays:
  - Top shadow and bottom vignette (`from-slate-950/85 via-slate-950/30 to-transparent`).
- Floating Glassmorphic Badges:
  - **Top-Left**: Frosted glass department badge (`backdrop-blur-md bg-white/20 border border-white/30 text-white shadow-sm px-3 py-1 rounded-full text-xs font-technical font-semibold`) with color indicator dot.
  - **Top-Right**: Live status indicator badge with animated pulsing green dot (`animate-pulse bg-emerald-400 w-1.5 h-1.5 rounded-full`) + label "Merekrut".
  - **Bottom-Left**: Location chip with map pin icon and frosted glass backdrop (`backdrop-blur-md bg-slate-950/60 text-white/95 border border-white/10 px-2.5 py-1 rounded-lg text-xs font-technical`).

### 2.3 Right Bento Content Panel
- Padding: `p-6 sm:p-7 flex-1 flex flex-col justify-between min-w-0`.
- Top Metadata Header:
  - Department eyebrow in dark navy/slate (`font-technical font-bold text-xs uppercase tracking-wider`).
  - Workplace type & job type pill (`Full-time • On-site`).
- Headline (Job Title):
  - `text-xl sm:text-2xl font-heading font-black text-[#17202A] group-hover:text-[#22416D] transition-colors leading-tight mb-3 line-clamp-2`.
- Metadata Bento Chips:
  - Experience Level capsule with icon (`1-3 Tahun`).
  - Workplace Type capsule with building icon (`On-site` / `Hybrid`).
- Compensation & Urgency:
  - Salary badge: `bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-mono font-bold px-3 py-1 rounded-lg` if salary shown; stylish neutral badge if competitive.
  - Deadline indicator: if expiring within 7 days, alert text with expiring badge; else clean formatted date.
- Bento Action Footer:
  - Subtle top border separator.
  - Interactive Action Button: "Lihat Detail" with animated circle chevron icon shifting right on hover (`group-hover:translate-x-1.5`).
