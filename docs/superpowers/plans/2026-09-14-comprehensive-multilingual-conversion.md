# Implementation Plan: Comprehensive Multilingual English Conversion

Audit and convert 100% of remaining Indonesian strings and hardcoded links across the public website when the language toggle is switched to English (`/en`).

## User Review Required

> [!NOTE]
> - All components will automatically detect the language from `Astro.url` (or via `lang?: 'id' | 'en'` prop) using `getLangFromUrl(Astro.url)`.
> - When `lang === 'en'`, all internal links will automatically point to `/en/...` ensuring the visitor remains in the English experience.
> - When `lang === 'id'`, all internal links will remain clean at root `/...` preserving 100% existing SEO rankings.

## Proposed Changes

### Phase 1: Core i18n Dictionaries & Helpers
- `src/i18n/ui.ts`: Expand dictionaries with comprehensive keys.
- `src/i18n/utils.ts`: Category and date helpers.

### Phase 2: Global Shell & Layout Components
- `src/components/Footer.astro`: Localized copy, office hours, and links.
- `src/components/SideMenu.astro`: Localized copy and links.
- `src/components/FloatingWhatsApp.astro`: Localized pill label and message.
- `src/components/Breadcrumb.astro`: Localized "Home" / "Beranda" and root url.

### Phase 3: Homepage Sections
- `AboutSection.astro`: Bilingual bento cards and badges.
- `ServicesSection.astro`: Bilingual services list.
- `ProjectSliderSection.astro`: Localized header and portfolio link.
- `CounterSection.astro`: Bilingual metrics.
- `WhyChooseUsSection.astro`: Bilingual reasons and guarantee.
- `ProcessSection.astro`: Bilingual 4-step workflow.
- `ConsultationCtaSection.astro`: Bilingual CTA and contact link.
- `TestimonialSection.astro`: Bilingual header.
- `BrandMarquee.astro`: Bilingual header.
- `FaqSection.astro`: Bilingual search, categories, and FAQs.
- `ContactSection.astro`: Pass `lang` to `ContactForm`.

### Phase 4: Portfolio & Blog English Routes
- `ProjectCard.astro`: Localized link, category, and "View Project".
- `src/pages/en/portfolio/[slug].astro`: English project detail page.
- `BlogCard.astro`: Localized link and "READ ARTICLE".
- `src/pages/en/blog/index.astro`: English blog index page.
- `src/pages/en/blog/[slug].astro`: English blog detail page.
- `TeamSection.astro`: Bilingual header and WhatsApp message.
