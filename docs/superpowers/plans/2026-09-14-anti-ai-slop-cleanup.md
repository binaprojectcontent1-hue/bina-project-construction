# Anti-AI-Slop Admin Dashboard Overhaul Plan

> Date: 2026-09-14
> Rulebook: [.agents/rules/dashboard-anti-ai-slop.md](../../.agents/rules/dashboard-anti-ai-slop.md)
> Target: `apps/dashboard/src`

## Objective
Eliminate all visual clichés typical of AI-generated dashboards across `apps/dashboard/src`:
1. Remove card strokes/outlines (`border border-slate-200/80` -> `border-0 bg-white rounded-2xl shadow-sm hover:shadow-md`).
2. Remove fake green pulsing badges and frivolous decorative sparkles (`<Sparkles />`, emojis).
3. Standardize micro-texts from unreadable `text-[10px]` / `text-[11px]` to clean `text-xs` (12px) / `text-sm` (14px).
4. Strictly enforce the signature Bina Studio Oceanic Palette (`#22416D`).

## Plan Steps
- [ ] Update `card.tsx` component.
- [ ] Refactor `Sidebar.tsx`.
- [ ] Refactor `Overview.tsx`.
- [ ] Refactor `Settings.tsx`.
- [ ] Refactor `RedirectsList.tsx`.
- [ ] Refactor `BusinessProfileSettings.tsx`.
- [ ] Refactor `PortfolioList.tsx`.
- [ ] Refactor `LiveProjectsManager.tsx`.
- [ ] Run `npm run --prefix apps/dashboard typecheck`.
- [ ] Run `npm run build`.
