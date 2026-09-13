# 📋 Master Blueprint: Prompts Audit Bertahap (Staged Codebase Audit)
> Panduan prompt terstruktur untuk mengaudit bug, konflik CSS/SCSS, layout shifting (CLS), script runtime, dan kepatuhan best practices Astro.

---

## 🧭 Cara Penggunaan

Gunakan prompt di bawah ini **satu per satu secara bertahap (per sesi)** ke AI assistant Anda. Pendekatan bertahap memberikan hasil analisis yang jauh lebih mendalam, akurat, dan tidak terpotong batas konteks (*context window*) dibandingkan audit sekaligus.

### Alur Eksekusi yang Disarankan:
1. **Fase 0:** Jalankan verifikasi otomatis CLI (`npx astro check`).
2. **Fase 1:** Audit Style Conflicts & CSS/SCSS Architecture.
3. **Fase 2:** Audit Layout Shifting (CLS) & Stabilitas Visual.
4. **Fase 3:** Audit Client-Side Scripting, Runtime Logic & Library Conflicts.
5. **Fase 4:** Audit Astro Architecture & Hydration Strategy (React/TSX Islands).
6. **Fase 5:** Audit Semantik, Aksesibilitas (a11y) & Technical SEO.

---

## 🛠️ Fase 0: Audit Otomatis CLI (Jalankan Sendiri di Terminal)

Sebelum memulai audit dengan AI, jalankan perintah berikut di terminal Anda untuk menangkap error tipe data atau broken link secara cepat:

```bash
# 1. Cek validitas sintaks & TypeScript pada komponen Astro
npx astro check

# 2. Uji build produksi untuk mendeteksi error kompilasi
npm run build
```

---

## 🎨 Fase 1: Audit Style Conflicts & CSS/SCSS Architecture

Salin prompt di bawah ini untuk mengidentifikasi bentrokan styling, kebocoran CSS global, perang spesifisitas, dan ketidakteraturan `z-index`:

```markdown
Bertindaklah sebagai Senior Frontend & CSS Architect. Lakukan AUDIT FASE 1: "Style Conflicts & CSS/SCSS Architecture" pada proyek web Astro ini.

📁 FOKUS FOLDER & FILE:
- `src/styles/` dan `public/assets/css/` (file CSS/SCSS global, vendor, bootstrap, main.css)
- `src/layouts/BaseLayout.astro` (impor CSS global)
- Blok `<style is:global>` dan `<style>` scoped di seluruh komponen `src/components/`

🔍 PARAMETER AUDIT:
1. Specificity Wars & Global Leaks: Apakah ada aturan CSS global yang tanpa sengaja menimpa komponen lokal (scoped) atau sebaliknya?
2. Overuse of `!important`: Cari penggunaan deklarasi `!important` yang merusak hierarki cascading dan mempersulit modifikasi komponen.
3. Duplicate & Conflicting Rules: Temukan deklarasi selector yang sama di tempat berbeda dengan aturan yang saling bertolak belakang.
4. Z-Index Warfare: Periksa penataan z-index pada elemen floating/overlay (Navbar sticky, dropdown menu, modal, offcanvas, slider controls, leaflet map container, dan notification badge). Apakah ada nilai z-index sembarangan (misal `99999`) yang berpotensi saling menutupi?
5. Bootstrap / Vendor Override: Apakah penimpaan class utilitas bawaan Bootstrap dilakukan dengan cara yang aman dan konsisten?

📋 FORMAT OUTPUT:
Sajikan temuan dalam tabel:
| No | File & Baris | Severity (Critical/High/Medium/Low) | Isu Styling / Konflik | Dampak | Rekomendasi Perbaikan (Diff/Snippet) |
```

---

## 📐 Fase 2: Audit Layout Shifting (CLS) & Stabilitas Visual

Salin prompt di bawah ini untuk memeriksa bug Cumulative Layout Shift yang menyebabkan elemen melompat saat halaman dibuka atau diinteraksi:

```markdown
Bertindaklah sebagai Web Performance & Core Web Vitals Specialist. Lakukan AUDIT FASE 2: "Layout Shifting (CLS) & Stabilitas Visual" pada proyek web Astro ini.

📁 FOKUS FOLDER & FILE:
- Komponen di `src/components/sections/` (HeroSection, ServicesSection, ProcessSection, WhyChooseUsSection, ProjectSliderSection, dll.)
- Komponen card dan media: `ProjectCard.astro`, `BrandMarquee.astro`, `CoverageMap.tsx`
- Layout utama: `src/layouts/BaseLayout.astro`

🔍 PARAMETER AUDIT:
1. Hover & Focus Shifting: Periksa seluruh efek `:hover` atau `:focus` pada tombol, kartu layanan, dan card portofolio.
   - Apakah ada perubahan `padding`, `margin`, atau `border-width` saat hover yang menggeser elemen tetangga?
   - Apakah transisi menggunakan CPU properties (`top`, `left`, `height`, `width`) alih-alih GPU-accelerated (`transform`, `opacity`)?
2. Unsized Media & Placeholders:
   - Apakah ada tag `<img>`, `<svg>`, atau `<iframe>` yang tidak mencantumkan atribut `width` dan `height` eksplisit atau CSS `aspect-ratio`?
   - Apakah kontainer peta interaktif (`CoverageMap`) dan banner memiliki tinggi minimum (`min-height`) saat data belum selesai dimuat?
3. Slider & Dynamic Initial Height:
   - Periksa komponen slider (seperti Swiper di HeroSection): Apakah tinggi kontainernya sudah terkunci sejak awal rendering HTML, atau anjlok sementara sebelum script slider terinisialisasi (FOUC)?
4. Web Fonts & Icon Flash:
   - Apakah pemuatan font kustom atau icon library memicu FOIT/FOUT yang menggeser teks di sekitarnya?

📋 FORMAT OUTPUT:
Sajikan temuan secara rinci:
1. Ringkasan Elemen yang Berpotensi Mengalami Layout Shift.
2. File & Selector CSS yang bermasalah.
3. Solusi kode sebelum (*before*) vs sesudah (*after*) menggunakan GPU acceleration / reserved sizing.
```

---

## ⚙️ Fase 3: Audit Client Scripts & Runtime Logic

Salin prompt di bawah ini untuk mendeteksi bug JavaScript pada browser, kesalahan penanganan skrip Astro, dan konflik library:

```markdown
Bertindaklah sebagai Senior JavaScript/TypeScript Engineer & Astro Runtime Expert. Lakukan AUDIT FASE 3: "Client-Side Scripting & Runtime Logic" pada proyek ini.

📁 FOKUS FOLDER & FILE:
- Seluruh tag `<script is:inline>` dan `<script>` di `src/components/` dan `src/layouts/`
- Berkas JavaScript klien: `public/assets/js/main.js` atau script integrasi pihak ketiga.

🔍 PARAMETER AUDIT:
1. Inline Scripts Compatibility:
   - Deteksi apakah ada anotasi tipe TypeScript (`: type`, `as any`, `<T>`, `interface`) di dalam blok `<script is:inline>` yang berisiko memicu `SyntaxError: Unexpected token ':'` di browser.
   - Periksa apakah script inline seharusnya dipindahkan ke bundled script modul Astro (`<script>`) agar diproses dan dioptimalkan oleh Vite.
2. View Transitions & Navigation Lifecycle:
   - Apakah script hanya mengandalkan event `DOMContentLoaded` atau `window.onload` sehingga gagal berjalan kembali saat navigasi halaman via Astro View Transitions (`astro:page-load`)?
   - Apakah ada script re-initialization guards yang mencegah inisialisasi ganda atau duplikasi instance plugin (misal Swiper, AOS, GLightbox)?
3. Memory Leaks & Event Listeners:
   - Apakah ada pemanggilan `setInterval`, `requestAnimationFrame`, atau `window.addEventListener('scroll')` yang tidak di-cleanup saat komponen dibongkar (*unmounted*)?
4. Library Scroll & Motion Conflicts:
   - Periksa interaksi antara **Lenis Smooth Scroll**, **GSAP ScrollTrigger**, **Swiper**, dan **Leaflet Map**.
   - Apakah Lenis tersinkronisasi dengan baik dengan `ScrollTrigger.update()`, atau apakah ada library yang berebut mengendalikan native scroll?

📋 FORMAT OUTPUT:
1. Daftar Potensi Runtime Exception / Console Error.
2. Analisis Lifecycle & Memory Safety.
3. Rekomendasi refactoring script inline ke pattern Astro modular yang aman.
```

---

## 🏝️ Fase 4: Audit Astro Architecture & Hydration Strategy

Salin prompt di bawah ini untuk mengevaluasi efisiensi *Islands Architecture*, penggunaan directive hidrasi, dan integritas SSR:

```markdown
Bertindaklah sebagai Astro Core Contributor & Fullstack Architect. Lakukan AUDIT FASE 4: "Astro Architecture & Hydration Strategy" pada proyek ini.

📁 FOKUS FOLDER & FILE:
- Komponen React / TSX: `src/components/CoverageMap.tsx`, `CoverageChecker.tsx`, `StackTestimonial.tsx`, dll.
- Halaman utama: `src/pages/` (index.astro, portfolio, blog, contact, dll.)
- Data services & helpers: `src/lib/`, `src/data/`

🔍 PARAMETER AUDIT:
1. Hydration Directives Efficiency:
   - Audit setiap pemanggilan komponen React: Apakah penggunaan `client:load`, `client:idle`, `client:visible`, atau `client:only` sudah optimal?
   - Apakah ada komponen di bagian bawah layar (*below-the-fold*) yang memakai `client:load` sehingga membebani First Input Delay (FID/INP)?
   - Apakah ada komponen interaktif yang sebenarnya cukup berupa HTML/CSS murni tanpa perlu library React?
2. SSR vs Browser Object Safety:
   - Pastikan tidak ada pemanggilan objek browser (`window`, `document`, `navigator`, `localStorage`) di bagian frontmatter Astro (`--- ... ---`) yang dieksekusi saat build time/server.
3. Asset Handling & Image Pipeline:
   - Apakah halaman masih menggunakan tag `<img>` standar untuk aset internal, alih-alih komponen `<Image />` dari `astro:assets` yang mengoptimasi WebP/AVIF dan responsive srcset secara otomatis?
4. Content Collections & Data Typing:
   - Apakah pengelolaan data portofolio, blog, dan layanan sudah memanfaatkan skema type-safe (`zod` di `src/content/config.ts` atau data schema TypeScript)?

📋 FORMAT OUTPUT:
1. Audit Tabel Directive Hidrasi (Nama Komponen, Directive Saat Ini, Saran Directive, Alasan).
2. Temuan Akses Objek Browser Ilegal pada Fase SSR/Build.
3. Rekomendasi Peningkatan Arsitektur & Reduksi Ukuran Bundle JavaScript.
```

---

## ♿ Fase 5: Audit Semantik, Aksesibilitas (a11y) & SEO

Salin prompt di bawah ini untuk memastikan kode ramah mesin pencari, lolos audit screen reader, dan memiliki struktur semantik yang kokoh:

```markdown
Bertindaklah sebagai Lead Technical SEO & Accessibility (a11y) Auditor. Lakukan AUDIT FASE 5: "Semantik HTML, Aksesibilitas & Technical SEO" pada proyek web Astro ini.

📁 FOKUS FOLDER & FILE:
- Halaman di `src/pages/`
- Komponen navigasi dan footer: `Header.astro`, `Footer.astro`, `MobileNav.astro`
- Data schema & SEO: `src/data/faqs.ts`, metadata di `BaseLayout.astro`

🔍 PARAMETER AUDIT:
1. Heading Hierarchy (`h1` - `h6`):
   - Apakah setiap halaman hanya memiliki tepat 1 `<h1>` yang merepresentasikan topik utama?
   - Apakah ada heading level yang melompat (misal langsung dari `h1` ke `h4`) yang membingungkan screen reader?
2. Interactive Elements & ARIA Labels:
   - Apakah tombol navigasi slider (panah kiri/kanan, pagination bullets), hamburger menu, dan tombol close modal memiliki atribut `aria-label` yang jelas?
   - Apakah link berupa ikon memiliki teks alternatif atau `aria-hidden="true"` pada ikon grafisnya?
3. Duplicate IDs:
   - Apakah ada duplikasi atribut `id="..."` di satu halaman yang berpotensi merusak seleksi JavaScript atau validitas HTML?
4. Semantic HTML5 Elements:
   - Apakah struktur layout sudah menggunakan tag semantik (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) alih-alih tumpukan `<div>` (*div soup*)?
5. Technical SEO & Rich Snippets:
   - Periksa implementasi Schema.org JSON-LD (FAQ, LocalBusiness/Contractor, Breadcrumbs). Apakah valid dan bebas dari error sintaks?
   - Apakah meta tags Open Graph, Twitter Cards, dan tag Canonical sudah terpasang dengan dinamis dan benar?

📋 FORMAT OUTPUT:
1. Skor Perkiraan Aksesibilitas (Lighthouse a11y) & Temuan Kritis.
2. Daftar Heading Structure per Halaman Utama.
3. Checklist Kontrol Interaktif yang Belum Accessible.
4. Rekomendasi Solusi & Cuplikan Kode Perbaikan.
```

---

## ⚡ Master Prompt (All-In-One Quick Audit)

Jika Anda ingin melakukan pemindaian kilat seluruh aspek sekaligus dalam satu kali jalan, gunakan Master Prompt di bawah ini:

```markdown
Bertindaklah sebagai Senior Fullstack Architect & Web Performance Specialist (spesialisasi Astro, Core Web Vitals, dan Modern CSS).

Lakukan AUDIT KILAT (Comprehensive Quick Scan) pada proyek web berbasis Astro ini untuk menemukan bug tersembunyi, benturan styling, dan pelanggaran standar best practices:

1. [CSS/SCSS]: Cari bentrokan antara global stylesheet dengan scoped styles, penggunaan `!important` berlebih, dan konflik z-index.
2. [CLS / Layout Shift]: Cari animasi hover yang mengubah margin/padding/border, tag gambar tanpa aspect-ratio/width/height, atau slider container yang anjlok sebelum script aktif.
3. [Script & Runtime]: Cari sintaks TypeScript yang bocor ke `<script is:inline>`, memory leak pada event listener, atau script yang gagal di-trigger saat Astro View Transitions.
4. [Astro Islands]: Evaluasi ketepatan penggunaan `client:*` hydration directives pada komponen React/TSX dan keamanan akses objek browser (window/document) di SSR.
5. [a11y & SEO]: Periksa hierarki heading tunggal `<h1>`, duplicate ID, dan kelengkapan `aria-label` pada tombol interaktif.

Sajikan hasil audit secara terstruktur:
- Severity Level (Critical / High / Medium / Low)
- Lokasi File & Baris Kode
- Penjelasan Masalah & Dampaknya
- Rekomendasi Solusi & Cuplikan Kode Perbaikan (Diff/Snippet)
```

---

## 🎨 Lanjutan: Audit Desain & Konsistensi UI/UX
Untuk audit mendalam khusus konsistensi visual, layout, ritme spacing/gap, tipografi, dan kepatuhan standar desain, gunakan panduan bertahap di:
👉 **[DESIGN_AUDIT_PROMPTS.md](file:///d:/binaproject/DESIGN_AUDIT_PROMPTS.md)**

