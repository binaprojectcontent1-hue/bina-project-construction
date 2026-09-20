# 🎨 Master Blueprint: Prompts Audit Desain Bertahap (Staged UI/UX & Design Consistency Audit)
> Panduan prompt bertahap untuk mengaudit konsistensi visual, standarisasi layout, ritme spacing & gap, tipografi, serta kepatuhan Design System pada website Bina Project.

---

## 🧭 Cara Penggunaan

Gunakan prompt di bawah ini **satu per satu secara bertahap (per sesi)** kepada AI assistant Anda. Pendekatan bertahap memastikan setiap aspek visual dianalisis secara mikroskopis tanpa terlewat atau terpotong batas konteks (*context window*).

### Alur Eksekusi Audit Desain:
1. **Fase D1:** Design Tokens, Palet Warna & Harmoni Brand (Bina Navy Fidelity).
2. **Fase D2:** Tipografi, Skala Modular & Hierarki Teks.
3. **Fase D3:** Spacing Rhythm, Standarisasi Gap & Whitespace.
4. **Fase D4:** Grid System, Lebar Kontainer & Keselarasan Layout (Layout Alignment).
5. **Fase D5:** Standarisasi Komponen UI (Buttons, Cards, Badges & Form Controls).
6. **Fase D6:** Visual Polish, Micro-Interactions & Luxury Brand Aesthetics.
7. **Fase D7:** Mobile-First Architecture, Touch Ergonomics & Small-Screen Fidelity.

---

## 🎨 Fase D1: Design Tokens, Palet Warna & Harmoni Brand

Salin prompt di bawah ini untuk mendeteksi warna liar (*rogue colors*), inkonsistensi gradasi, dan memastikan palet warna selaras dengan identitas brand Bina Project:

```markdown
Bertindaklah sebagai Lead Design Systems Architect & Brand Identity Specialist. Lakukan AUDIT FASE D1: "Design Tokens, Palet Warna & Harmoni Brand" pada proyek website Bina Project ini.

📁 FOKUS FOLDER & FILE:
- `src/styles/` (global.css, coverage.css)
- `public/assets/css/` (style.css, bootstrap.min.css)
- Blok `<style>` scoped & inline CSS di `src/components/sections/` dan `src/pages/`

🎯 SPESIFIKASI PALET RESMI BINA PROJECT:
- Primary Brand: `#22416D` (Bina Navy)
- Secondary / Dark Surface: `#0D192B` / `#0A1320`
- Accent / Tech Blue: `#345F99`, `#84ACDF` (Ice Blue)
- Light Neutral: `#FFFFFF`, `#F8FAFC`, `#F1F5F9`, `#E2E8F0`
- Dark Neutral / Text: `#17202A`, `#334155`, `#64748B`, `#94A3B8`

🔍 PARAMETER AUDIT:
1. Deteksi Rogue & Hardcoded Colors:
   - Temukan penggunaan kode warna heksadesimal atau warna bernama sembarangan (seperti `#000`, `#333`, `#2563eb`, `blue`, `#ff0000`, atau warna default bawaan Bootstrap/template lama) yang melenceng dari palet resmi Bina Project.
2. Konsistensi Background Surfaces:
   - Periksa latar belakang antar section yang bersinggungan (misal transisi dari section putih `#ffffff` ke abu-abu muda `#f8fafc` atau dark navy `#0d192b`). Apakah transisi warna terasa harmonis atau terputus kasar?
3. Gradients & Overlay Opacity:
   - Apakah efek gradasi warna navy overlay pada Hero slider, kartu layanan, dan background section menggunakan formula RGBA/linear-gradient yang seragam?
4. Contrast Ratio (Keterbacaan & WCAG AA):
   - Apakah ada teks abu-abu/biru muda di atas latar belakang terang yang kontrasnya terlalu rendah (< 4.5:1) sehingga sulit dibaca?
   - Apakah teks putih di atas banner/gambar memiliki backdrop shadow atau dark overlay pelindung yang cukup?

📋 FORMAT OUTPUT:
Sajikan temuan dalam tabel terstruktur:
| No | Lokasi File & Selector | Warna Saat Ini | Masalah / Deviasi | Rekomendasi Pengganti (Token Resmi) |
|----|------------------------|----------------|-------------------|-------------------------------------|
```

---

## 🔤 Fase D2: Tipografi, Skala Modular & Hierarki Teks

Salin prompt di bawah ini untuk menertibkan ukuran font, bobot, jarak antar baris, dan kerapian perataan teks:

```markdown
Bertindaklah sebagai Senior Editorial & UI Typography Expert. Lakukan AUDIT FASE D2: "Tipografi, Skala Modular & Hierarki Teks" pada website ini.

📁 FOKUS FOLDER & FILE:
- `src/styles/global.css` dan `src/layouts/BaseLayout.astro`
- Komponen teks: `src/components/sections/` (Hero, About, Process, WhyChooseUs, Services, dll.)
- Komponen card: `ProjectCard.astro`, `BlogCard.astro`, `StackTestimonial.tsx`

🎯 STANDAR TIPOGRAFI BINA PROJECT:
- Font Judul (Headings / Display): `'Archivo', sans-serif` atau `'Titillium Web', sans-serif`
- Font Isi (Body / Descriptions): `'DM Sans', sans-serif` / Sans-serif modern
- Bobot yang diizinkan: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

🔍 PARAMETER AUDIT:
1. Font Family Leakage:
   - Apakah ada komponen atau elemen teks yang kembali menggunakan font default browser (`Times`, `Arial`) atau font template asing tanpa didefinisikan ke font token resmi?
2. Modular Type Scale & Arbitrary Font Sizes:
   - Identifikasi ukuran font arbitrer yang tidak standar (contoh: `font-size: 17px`, `font-size: 23px`, `font-size: 41px`).
   - Apakah ukuran `h1` (36px–56px), `h2` (28px–40px), `h3` (20px–26px), dan body (14px–16px) konsisten di seluruh halaman?
3. Line Height (Leading) & Letter Spacing (Tracking):
   - Apakah line-height judul sudah proporsional (1.1 – 1.25) sehingga tidak renggang berlebihan?
   - Apakah line-height paragraf body cukup lega untuk kenyamanan membaca (1.6 – 1.8)?
   - Apakah label sub-title / badge uppercase menggunakan tracking yang rapi (`letter-spacing: 0.05em` – `0.1em`)?
4. Text Alignment & Justification Safety:
   - Periksa pemakaian kelas `.text-justify`. Apakah menyebabkan celah spasi renggang yang jelek (*rivers of white space*) saat dilihat di layar smartphone?
   - Kapan heading dan paragraf harus `text-start` (left-aligned) vs `text-center` agar seragam di setiap section?

📋 FORMAT OUTPUT:
Sajikan temuan:
1. Ringkasan Ketidaksesuaian Font Family & Bobot.
2. Tabel Skala Font (Nama Elemen, Ukuran Saat Ini, Standar Skala yang Disarankan).
3. Kode CSS Normalisasi Tipografi (Before vs After).
```

---

## 📏 Fase D3: Spacing Rhythm, Standarisasi Gap & Whitespace

Salin prompt di bawah ini untuk mengaudit jarak vertikal/horizontal, gap antar kartu, dan ritme whitespace agar tidak ada bagian yang terlalu sempit atau bolong:

```markdown
Bertindaklah sebagai Design System Engineer & Spacing Specialist. Lakukan AUDIT FASE D3: "Spacing Rhythm, Standarisasi Gap & Whitespace" pada proyek ini.

📁 FOKUS FOLDER & FILE:
- Seluruh section di `src/components/sections/`
- Layout halaman di `src/pages/`
- Komponen card: `ProjectCard.astro`, `CoverageChecker.astro`, `ContactForm.astro`

🎯 ATURAN SPACING BINA PROJECT:
- Section Vertical Rhythm: Standar padding section seragam (Desktop: 90px–110px, Tablet: 60px–80px, Mobile: 45px–55px).
- Grid Gaps: Standar 8-point grid scale (`16px`, `24px`, `32px`, `48px`).
- Card Internal Padding: Standar `24px` hingga `36px` untuk kenyamanan visual.

🔍 PARAMETER AUDIT:
1. Section Padding Inconsistency:
   - Bandingkan padding atas (`space-top`, `padding-top`) dan padding bawah (`space-bottom`, `padding-bottom`) di setiap section (Hero -> About -> Services -> Process -> Portfolio -> Testimonial -> Contact).
   - Apakah ada section yang tiba-tiba berjarak sangat sempit (misal 30px) atau terlalu renggang (misal 160px)?
2. Grid & Flex Gap Regularity:
   - Periksa gap antar kolom dan kartu. Apakah terjadi bentrokan antara kelas Bootstrap (`g-4`, `gx-3`, `gy-4`) dengan manual CSS (`margin`, `padding`) yang membuat jarak antar kartu tidak presisi?
   - Apakah jarak vertikal antar baris kartu sama dengan jarak horizontalnya?
3. Component-Level Micro-Spacing:
   - Jarak antara icon dan teks pendamping (standar: 8px – 12px).
   - Jarak antara Subtitle Badge dan Heading H2 (standar: 10px – 16px).
   - Jarak antara Heading H2 dan Paragraf deskripsi (standar: 14px – 20px).
   - Jarak antara Paragraf dan Tombol Call-to-Action (standar: 24px – 32px).
4. Margin Collapsing & Spacing Stack Bug:
   - Deteksi margin negatif atau tumpukan margin bawah (`margin-bottom`) beruntun yang merusak proporsi elemen di bawahnya.

📋 FORMAT OUTPUT:
1. Tabel Evaluasi Spacing Antar Section (Nama Section, Padding Top/Bottom Saat Ini, Status, Rekomendasi).
2. Temuan Gap Grid yang Asimetris / Tidak Konsisten.
3. Snippet Token Spacing CSS Terpadu yang siap diaplikasikan.
```

---

## 📐 Fase D4: Grid System, Lebar Kontainer & Keselarasan Layout

Salin prompt di bawah ini untuk memastikan seluruh elemen berada di dalam jalur grid yang rapi dan tidak melenceng di berbagai resolusi layar:

```markdown
Bertindaklah sebagai Lead Responsive Layout Architect. Lakukan AUDIT FASE D4: "Grid System, Lebar Kontainer & Keselarasan Layout" pada website ini.

📁 FOKUS FOLDER & FILE:
- `src/layouts/BaseLayout.astro`
- Seluruh section: `src/components/sections/`
- Layout halaman khusus: `src/pages/portfolio/`, `src/pages/contact.astro`, `src/pages/about.astro`

🎯 STANDAR KONTAINER BINA PROJECT:
- Max Container Width Desktop: Standar 1280px–1320px (`.container` / `.th-container`)
- Full-width / Fluid Container: `.container-fluid` dengan horizontal gutter terkontrol (15px–24px)
- Breakpoint Standar: Mobile (375px–575px), Tablet (768px–991px), Desktop (1200px+)

🔍 PARAMETER AUDIT:
1. Container Alignment & Gutter Consistency:
   - Apakah garis tepi kiri dan kanan dari setiap section lurus vertikal (*flush alignment*) dari navigasi header hingga footer?
   - Apakah ada section yang menggunakan class kontainer berbeda sehingga lebarnya menyempit atau melebar sendiri dibandingkan section lain?
2. Bento Grid & Column Ratios:
   - Periksa layout bergaya Bento Grid (pada Services, WhyChooseUs, Process, dan Contact Bento).
   - Apakah rasio kolom (misal 8:4, 6:6, 7:5, 4:4:4) seimbang dan proporsional?
3. Equal Height Card Alignment:
   - Apakah seluruh kartu di dalam satu baris grid memiliki tinggi yang sama (*equal height* via `height: 100%` atau `display: flex; flex-direction: column`)?
   - Apakah tombol atau footer kartu selalu sejajar lurus di dasar kartu meskipun panjang teks deskripsi berbeda?
4. Responsive Collapse & Breakpoint Jumps:
   - Uji bagaimana grid runtuh (*wrap*) saat mengecil dari Desktop ke Tablet dan Mobile:
     - Apakah ada kolom 3 yang langsung berubah menjadi 1 kolom terlalu dini (menyisakan ruang kosong besar)?
     - Apakah urutan susunan kolom saat mobile (*order-first* / *order-last*) tetap logis dan tidak membingungkan pengguna?
5. Horizontal Overflow / Side Scrolling:
   - Deteksi elemen visual (gambar, diagram SVG, ticker ribbon, table) yang lebarnya melebihi 100vw dan memicu scrollbar horizontal di layar ponsel.

📋 FORMAT OUTPUT:
1. Daftar Penyimpangan Lebar Kontainer per Section.
2. Identifikasi Kartu yang Tinggi / Dasarnya Tidak Sejajar.
3. Solusi CSS Grid / Flexbox untuk Keselarasan Layout Presisi.
```

---

## 🧩 Fase D5: Standarisasi Komponen UI (Buttons, Cards, Badges & Forms)

Salin prompt di bawah ini untuk menstandarkan gaya tombol, lengkungan sudut (border-radius), bayangan (shadow), dan kartu:

```markdown
Bertindaklah sebagai Senior UI Component Designer & Systems Specialist. Lakukan AUDIT FASE D5: "Standarisasi Komponen UI (Buttons, Cards, Badges & Forms)" pada proyek ini.

📁 FOKUS FOLDER & FILE:
- Komponen interaktif: `src/components/Header.astro`, `ContactForm.astro`, `CoverageChecker.astro`
- Kartu UI: `ProjectCard.astro`, `BlogCard.astro`, `StackTestimonial.tsx`, `ProcessSection.astro`
- Tombol & Link: Seluruh tag `.th-btn`, `.btn`, tag `<button>`, dan link CTA

🎯 STANDAR KOMPONEN BINA PROJECT:
- Border Radius Scale: `8px` (kecil/badge), `12px` - `16px` (form input & tombol), `20px` - `24px` (kartu modern / bento), `9999px` (pill)
- Borderless Luxury Philosophy: Kartu modern menggunakan prinsip *zero-outline borderless* (`border: none`) dengan elevasi lembut atau latar subtle.
- Button Hierarchy: Primary (Bina Navy Fill), Secondary (Ice Blue / Dark Accent), Ghost / Outline (Border halus).

🔍 PARAMETER AUDIT:
1. Button Variants & Inconsistent Paddings:
   - Apakah ada tombol CTA yang tingginya berbeda-beda padahal selevel?
   - Apakah sudut lengkung tombol konsisten di seluruh website (misal ada yang kotak bersudut tajam, ada yang setengah membulat, ada yang pil)?
   - Apakah transisi hover tombol memiliki efek feedback visual yang elegan (misal: slight lift `translateY(-2px)`, shadow glow halus)?
2. Card Styling Consistency:
   - Periksa seluruh kartu (Service Card, Project Card, Process Card, WhyChooseUs Card, Testimonial Card).
   - Apakah border-radius kartu seragam?
   - Apakah bayangan kartu (*box-shadow*) halus dan mewah (`rgba(0, 0, 0, 0.04)` hingga `0.08`), atau ada yang menggunakan drop shadow tebal dan kaku?
3. Badge & Sub-title Alignment:
   - Periksa badge kategori di atas judul section (`.sub-title`, tag portofolio, status QC).
   - Apakah gaya visual badge (warna background, icon titik/simbol, padding `6px 14px`, text-transform uppercase) seragam di setiap section?
4. Form Controls & Input Fields:
   - Periksa form di halaman Contact dan Coverage Checker.
   - Apakah tinggi input field konsisten (misal standar 52px–56px)?
   - Apakah state `:focus` pada input menampilkan ring warna Bina Navy yang bersih, bukan outline default browser?

📋 FORMAT OUTPUT:
1. Checklist Kepatuhan Komponen (Buttons, Cards, Badges, Forms).
2. Tabel Ketidakkonsistenan Komponen & Lokasi File.
3. Rekomendasi Snippet CSS untuk Penyeragaman Komponen.
```

---

## ✨ Fase D6: Visual Polish, Micro-Interactions & Luxury Brand Aesthetics

Salin prompt di bawah ini untuk memberikan sentuhan akhir visual, animasi halus, dan memastikan kesan mewah khas kontraktor arsitektur premium:

```markdown
Bertindaklah sebagai Principal Creative Director & UI Motion Specialist. Lakukan AUDIT FASE D6: "Visual Polish, Micro-Interactions & Luxury Brand Aesthetics" pada website ini.

📁 FOKUS FOLDER & FILE:
- Efek visual & animasi di `src/components/` (HeroSection, ProjectSlider, ProcessSection, BrandMarquee)
- Ikonografi: SVG icons di seluruh section
- Transisi gambar dan kartu portofolio

🎯 AESTHETIC GOAL BINA PROJECT:
Mencerminkan identitas kontraktor arsitektur & konstruksi modern premium: berwibawa, kokoh, bersih (*clean minimalist*), presisi tinggi, dan elegan (tidak murahan atau berlebihan).

🔍 PARAMETER AUDIT:
1. Transition Timing & Easing:
   - Apakah seluruh transisi hover kartu, tombol, dan gambar menggunakan durasi yang wajar (250ms–350ms) dengan easing halus (`cubic-bezier(0.16, 1, 0.3, 1)` atau `ease-out`)?
   - Hindari efek transisi kaku (`ease`, `linear`) atau terlalu lambat (> 600ms) yang membuat website terasa lamban.
2. Image Framing, Aspect Ratios & Zoom Effects:
   - Apakah gambar portofolio dan proyek menggunakan aspect-ratio yang konsisten (misal: 16:9 untuk banner, 4:3 untuk grid kartu)?
   - Apakah efek hover pada gambar kartu (misal: `scale(1.05)`) terpotong rapi dengan `overflow: hidden` pada kontainer induknya?
3. Ikonografi & Visual Weight:
   - Apakah seluruh ikon memiliki gaya visual yang seragam (stroke/line vs solid/fill)?
   - Apakah ketebalan garis (*stroke-width*) ikon tampak seimbang dan tidak ada icon yang terlalu raksasa atau terlalu kerdil?
4. Glassmorphism & Backdrop Effects:
   - Apakah efek kaca (*blur overlay*) pada header sticky, popup modal, dan floating card memiliki blur yang cukup (`backdrop-filter: blur(10px - 16px)`) dan border semi-transparan yang elegan (`border: 1px solid rgba(255, 255, 255, 0.12)`)?
5. Polish & Brand Vibe Check:
   - Temukan setiap detail visual yang terlihat "mentah" atau seperti template belum selesai (misal divider garis yang terlalu mencolok, teks abu-abu yang mati, alignment bullet list yang berantakan).

📋 FORMAT OUTPUT:
1. Review Keseluruhan Estetika Brand (Skor Kemewahan & Kerapian Visual 1-10).
2. Temuan Visual Polish yang Perlu Disempurnakan.
3. Rekomendasi Enhancement CSS & Animasi Halus.
```

---

## 📱 Fase D7: Mobile-First Architecture, Touch Ergonomics & Small-Screen Fidelity

Salin prompt di bawah ini untuk mengaudit kenyamanan pengalaman pengguna pada perangkat seluler (smartphone 360px–430px), memastikan kepatuhan Fitts's Law (touch targets), eliminasi horizontal scroll, dan hierarki visual mobile:

```markdown
Bertindaklah sebagai Lead Mobile UX Architect & Responsive Design Specialist. Lakukan AUDIT FASE D7: "Mobile-First Architecture, Touch Ergonomics & Small-Screen Fidelity" pada halaman website Bina Project ini.

🎯 TARGET VIEWPORT TESTING:
- Ultra-Compact: `360px` - `375px` (Galaxy S/A series, iPhone SE)
- Modern Flagship: `390px` - `412px` (iPhone 13-16 standard, Pixel, Galaxy Ultra)
- Large Pro / Phablet: `430px` (iPhone Pro Max, Plus series)

🔍 PARAMETER AUDIT MOBILE-FIRST:
1. Zero Horizontal Overflow (Anti Side-Scrolling):
   - Deteksi elemen apa pun (gambar, ticker ribbon, SVG blueprint, table, container-fluid) yang menyebabkan scrollbar horizontal atau konten terpotong ke samping di layar 360px–430px.
   - Pastikan gutter samping kiri-kanan konsisten (16px–24px safe zone) sehingga elemen tidak menempel ke tepi layar ponsel.
2. Touch Target Ergonomics & Fitts's Law:
   - Periksa seluruh elemen interaktif (tombol CTA, hamburger button, menu link, chevron accordion, tab filter, swiper arrow/dots, lightbox button).
   - Apakah seluruh area sentuh (*tap target*) memenuhi standar minimal 44x44px atau 48x48px?
   - Apakah jarak antar tombol sentuh cukup lega untuk menghindari salah pencet (*accidental mis-taps*)?
3. Tipografi Mobile & Justification Safety:
   - Periksa apakah judul besar (H1/H2) memiliki font-size yang proporsional via `clamp()` (tidak pecah berlebihan menjadi 4-5 baris atau menabrak tepi).
   - Temukan dan hapus penggunaan kelas `.text-justify` pada body text yang memicu celah renggang jelek (*rivers of white space*) di layar mobile sempit. Ganti ke `.text-start`.
   - Pastikan teks terkecil tidak kurang dari 13px demi keterbacaan mata tanpa perlu pinch-to-zoom.
4. Mobile Stacking Order & Bento Collapse:
   - Periksa urutan susunan konten saat grid desktop runtuh menjadi 1 kolom:
     - Apakah urutan elemen tetap logis (misal: Headline & Value Proposition terlebih dahulu sebelum gambar visual atau formulir)?
     - Apakah kartu bento atau kartu proses memiliki tinggi fleksibel yang rapi (*no text truncation / no weird whitespace*)?
   - Periksa sticky cards pada section "Bagaimana Prosesnya?": Apakah offset sticky `top` memperhitungkan tinggi mobile header sehingga kartu tidak tertutup navigasi saat digulir?
5. Form Controls & Input Usability:
   - Periksa form di Contact dan Coverage Checker: Apakah ukuran font input field minimal 16px untuk mencegah iOS Safari melakukan auto-zoom otomatis yang mengganggu?
   - Apakah tombol kirim mudah dijangkau satu tangan (area *thumb zone*)?
6. Navigasi & Drawer Menu:
   - Apakah drawer mobile menu terbuka mulus dengan animasi fluid, memiliki backdrop overlay pelindung, dan mengunci scroll halaman utama (*body scroll lock*) saat aktif?

📋 FORMAT OUTPUT:
1. Tabel Temuan Mobile Audit (Lokasi Elemen, Masalah Ergonomi/Viewport, Standar Mobile-First, Rekomendasi CSS/HTML).
2. Snippet Perbaikan Media Queries (`@media (max-width: 767px)` dan `@media (max-width: 575px)`).
```

---

## 📄 Prompts Audit Khusus Per Halaman (Page-Specific Mobile-First Prompts)

Gunakan prompt spesifik di bawah ini saat Anda ingin mengaudit satu halaman tertentu secara mendalam:

### 🏠 1. Audit Mobile: Halaman Beranda (Homepage `/`)
```markdown
Bertindaklah sebagai Mobile UX Architect. Lakukan AUDIT MOBILE-FIRST KHUSUS pada "Halaman Beranda (Homepage `/`)" di `src/pages/index.astro` dan komponen-komponennya (`src/components/sections/`).

Fokus Audit:
1. Hero Section: Keterbacaan headline di atas gambar mobile, posisi tombol CTA utama dalam jangkauan jempol, dan kehalusan slide swipe.
2. Text Ticker Ribbon: Pastikan tidak memicu horizontal overflow di layar 360px–375px.
3. About Bento Section: Periksa susunan tumpuk foto arsitektur dan 3 pilar bento frameless agar rapi dan proporsional.
4. Services Carousel: Responsivitas swiper kartu layanan pada layar ponsel (1 kartu per layar, pagination dots yang mudah disentuh).
5. "Bagaimana Prosesnya?" (Stacking Deck): Uji perilaku sticky stacking cards pada layar mobile. Pastikan kartu tidak menabrak mobile sticky header dan teks target terbaca nyaman.
6. Counter & Why Choose Us: Kerapian grid angka statistik dan kartu keunggulan saat bertumpuk 1 kolom vertikal.
7. FAQ Accordion: Kemudahan membuka-tutup accordion dengan satu tangan dan transisi chevron yang responsif.
8. Contact Section & Footer: Kerapian footer navigasi dan tombol hubungi kami.

Sajikan: Tabel masalah visual/ergonomi mobile di Homepage dan solusi CSS/HTML perbaikannya.
```

### 🏛️ 2. Audit Mobile: Halaman Portofolio (`/portfolio` & `/portfolio/[slug]`)
```markdown
Bertindaklah sebagai Mobile UX Architect. Lakukan AUDIT MOBILE-FIRST KHUSUS pada "Halaman Portofolio" di `src/pages/portfolio/index.astro`, `src/components/ProjectCard.astro`, dan `src/pages/portfolio/[slug].astro`.

Fokus Audit:
1. Filter Tabs: Kemudahan memilih kategori filter (Eksterior, Interior, Konstruksi) pada layar smartphone. Apakah tombol tab horizontal overflow rapi atau bertumpuk anggun tanpa terpotong?
2. Grid Kartu Portofolio: Kerapian kartu borderless saat menjadi 1 kolom penuh di mobile, keterbacaan teks putih (kategori, lokasi, judul) di atas foto, dan ukuran touch target tombol lightbox/detail.
3. Halaman Detail Proyek (`[slug].astro`): 
   - Proporsi foto cover utama pada layar kecil.
   - Kerapian daftar spesifikasi proyek (Klien, Kategori, Tanggal, Lokasi) saat dilihat di ponsel.
   - Grid galeri foto dokumentasi dan navigasi tombol "Kembali ke Portfolio".

Sajikan: Temuan masalah mobile dan rekomendasi CSS responsif.
```

### 📰 3. Audit Mobile: Halaman Blog (`/blog` & `/blog/[slug]`)
```markdown
Bertindaklah sebagai Mobile UX Architect. Lakukan AUDIT MOBILE-FIRST KHUSUS pada "Halaman Blog" di `src/pages/blog/index.astro`, `src/components/BlogCard.astro`, dan `src/pages/blog/[slug].astro`.

Fokus Audit:
1. Blog Card Grid: Lebar kartu artikel pada layar ponsel, ukuran font judul artikel, jarak metadata (tanggal & kategori), dan ukuran tombol "Baca Selengkapnya".
2. Halaman Detail Artikel (`[slug].astro`):
   - Keterbacaan tipografi artikel panjang pada ponsel (ukuran font 16px–17px, line-height 1.7–1.8, eliminasi text-justify).
   - Responsivitas gambar sisipan artikel dan kutipan (*blockquotes*).
   - Kerapian tombol share sosial media dan navigasi artikel terkait.

Sajikan: Temuan masalah mobile dan rekomendasi CSS responsif.
```

### 🏢 4. Audit Mobile: Halaman Tentang Kami (`/about.astro`)
```markdown
Bertindaklah sebagai Mobile UX Architect. Lakukan AUDIT MOBILE-FIRST KHUSUS pada "Halaman Tentang Kami" di `src/pages/about.astro`.

Fokus Audit:
1. Composition Frame: Periksa tumpukan foto visual arsitektur utama dan secondary inset photo agar tidak saling menabrak atau terpotong di mobile.
2. Interaktivitas Peta Jangkauan Layanan (`CoverageMap.tsx` / `CoverageChecker.astro`):
   - Apakah peta Leaflet tidak "menjebak" scroll jari pengguna saat menggulir halaman mobile (*scroll-trap prevention* / gesture handling)?
   - Kerapian input cek wilayah layanan di ponsel.
3. Visi, Misi & Statistik: Periksa ritme spasi vertikal agar tidak ada bagian yang terasa terlalu renggang atau terlalu sesak.

Sajikan: Temuan masalah mobile dan rekomendasi CSS responsif.
```

### 📞 5. Audit Mobile: Halaman Kontak (`/contact.astro`)
```markdown
Bertindaklah sebagai Mobile UX Architect. Lakukan AUDIT MOBILE-FIRST KHUSUS pada "Halaman Kontak" di `src/pages/contact.astro` dan `src/components/ContactForm.astro`.

Fokus Audit:
1. Contact Info Bento: Tumpukan kartu info (WhatsApp, Email, Alamat Kantor, Jam Kerja) agar mudah di-tap untuk langsung menelpon atau membuka Google Maps.
2. Form Input Fields: 
   - Ukuran font input field minimal 16px (mencegah auto-zoom paksa pada iOS Safari).
   - Padding input yang nyaman untuk jari jempol (tinggi minimal 50px).
   - Tombol kirim pesan yang jelas, kontras, dan berukuran penuh (*full-width*) di mobile.
3. Peta Interaktif Kantor: Aksesibilitas navigasi petunjuk arah di layar sentuh.

Sajikan: Temuan masalah mobile dan rekomendasi CSS perbaikan form & bento.
```

---

## ⚡ Master Design Prompt (All-In-One Quick Design Scan)

Jika Anda ingin melakukan pemindaian menyeluruh terhadap konsistensi desain, layout, dan gap dalam satu kali jalan, gunakan Master Design Prompt berikut:

```markdown
Bertindaklah sebagai Lead Design Systems Architect & Senior UI/UX Specialist.

Lakukan AUDIT KONSISTENSI DESAIN KILAT (Comprehensive Design & Layout Scan) pada website Bina Project ini untuk memastikan seluruh elemen visual, tata letak, dan jarak memenuhi standar presisi tinggi dan tidak melenceng dari identitas desain:

1. [Warna & Brand]: Deteksi warna heksadesimal liar di luar palet resmi Bina Navy (`#22416D`), dark surfaces (`#0D192B`), dan accent blue. Periksa kecukupan rasio kontras teks.
2. [Tipografi]: Periksa konsistensi font family (Archivo / Titillium Web untuk Judul, DM Sans untuk Body), skala modular ukuran font, proporsi line-height, dan eliminasi text-justify yang merusak estetika mobile.
3. [Spacing & Gap]: Periksa keseragaman padding atas-bawah pada setiap section (`90px–110px` desktop, `50px` mobile), standarisasi gap grid antar kartu (16px, 24px, 32px), dan konsistensi jarak antar elemen (icon, badge, heading, body, button).
4. [Layout & Grid Alignment]: Pastikan tepi kiri-kanan konten di seluruh section lurus vertikal (*container flush alignment*), kartu di baris yang sama memiliki tinggi rata (*equal height*), dan tidak ada horizontal overflow di viewport mobile (375px–430px).
5. [Komponen & Detail Visual]: Standarisasi border-radius (badge 8px, button/input 12-16px, card 20-24px), pastikan filosofi *borderless luxury* diterapkan rapi tanpa border kasar yang tidak diinginkan, dan periksa keseragaman gaya tombol.

Sajikan hasil audit secara terstruktur:
- Tingkat Keparahan Deviasi (Kritis / Sedang / Minor)
- Lokasi File & Elemen/Selector
- Analisis Deviasi Desain (Kondisi Saat Ini vs Standar Desain)
- Dampak Visual Terhadap Pengguna
- Solusi Kode CSS/HTML Presisi untuk Perbaikan
```
