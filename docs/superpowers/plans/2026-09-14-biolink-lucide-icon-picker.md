# Full 1,800+ Lucide Icon Picker for Bio Link Plan

> Date: 2026-09-14
> Scope: `apps/dashboard/src` & `apps/biolink/src`

## Objective
Expand Bio Link icon choices from 10 presets to full 1,800+ Lucide icons with categorized tabs and bilingual search.

## Plan Steps
- [ ] Create `apps/dashboard/src/components/IconPickerModal.tsx`.
- [ ] Integrate `IconPickerModal` and dynamic resolver in `apps/dashboard/src/pages/BioLinkEditor.tsx`.
- [ ] Update dynamic icon resolver in `apps/biolink/src/components/LinkButton.tsx`.
- [ ] Verify with typecheck and builds (`npm run typecheck:dash`, `npm run typecheck:bio`, `npm run build`).
