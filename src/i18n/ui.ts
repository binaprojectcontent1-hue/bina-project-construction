/**
 * @file ui.ts
 * @description Centralized Type-Safe Translation Dictionary for Bina Project
 */

export const languages = {
  id: 'Bahasa Indonesia',
  en: 'English',
} as const;

export type Language = keyof typeof languages;

export const defaultLang: Language = 'id';

export const ui = {
  id: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'Tentang Kami',
    'nav.portfolio': 'Portfolio',
    'nav.liveProjects': 'Proyek Berjalan',
    'nav.articles': 'Artikel',
    'nav.contact': 'Kontak Kami',

    // Call To Action
    'cta.consultation': 'KONSULTASI GRATIS',
    'cta.contactUs': 'Hubungi Kami',
    'cta.viewAllProjects': 'Lihat Semua Proyek',
    'cta.askSimilarProject': 'Konsultasi Proyek Serupa',
    'cta.exploreServices': 'Jelajahi Layanan',

    // Site Identity & Meta
    'site.name': 'Bina Project',
    'site.tagline': 'Jasa Konstruksi & Desain Interior Malang',
    'site.description':
      'Jasa konstruksi, renovasi rumah, desain interior & kitchen set di Malang & Jawa Timur. Pengerjaan profesional, bergaransi & gratis survei lokasi.',

    // Hero Section
    'hero.badge': 'ARSITEKTUR & KONTRAKTOR PROFESIONAL',
    'hero.titlePrefix': 'Wujudkan Bangunan Impian dengan',
    'hero.titleHighlight': 'Presisi & Estetika Terbaik',
    'hero.subtitle':
      'Solusi terpadu konstruksi rumah modern, renovasi struktural, dan interior mewah di Malang & Jawa Timur. Bergaransi resmi, transparan, dan tepat waktu.',
    'hero.statProjects': 'Proyek Sukses Diselesaikan',
    'hero.statSatisfaction': 'Tingkat Kepuasan Klien',
    'hero.statWarranty': 'Garansi Pemeliharaan',

    // Live Projects Map
    'map.hudBadge': 'LIVE ON-GOING PROJECTS',
    'map.activeCount': 'Titik Proyek Aktif Sedang Berjalan',
    'map.filterAll': 'Semua Proyek',
    'map.filterConstruction': 'Konstruksi Baru',
    'map.filterRenovation': 'Renovasi',
    'map.filterInterior': 'Interior',
    'map.statusOngoing': 'Sedang Berjalan',
    'map.statusFinishing': 'Tahap Finishing',
    'map.statusStructural': 'Tahap Struktur',
    'map.statusPreparation': 'Tahap Persiapan',
    'map.progress': 'Progres',
    'map.targetCompletion': 'Target Selesai',
    'map.contractor': 'Pelaksana Lapangan',
    'map.architect': 'Arsitek Pengawas',
    'map.documentation': 'Dokumentasi Lapangan',
    'map.noDocumentation': 'Dokumentasi visual belum diunggah',

    // About Section (Homepage)
    'aboutSection.badge': 'Tentang Bina Project',
    'aboutSection.title': 'You Dream It, We Build It',
    'aboutSection.desc':
      'Mitra terpercaya untuk mewujudkan hunian dan ruang usaha Anda. Dari desain 3D hingga pengerjaan fisik dengan standar arsitektur profesional, transparansi RAB, dan kontrak legal resmi (SPK).',
    'aboutSection.proof1Title': '10+ Tahun Dedikasi',
    'aboutSection.proof1Sub': 'Arsitek & Tenaga Ahli Bersertifikasi',
    'aboutSection.proof2Label': 'Projek Sukses Selesai',
    'aboutSection.proof2Verified': '100% Tuntas Sesuai SPK',
    'aboutSection.pillar1Title': 'RAB Transparan & Mengikat',
    'aboutSection.pillar1Desc': 'Rincian volume material dan harga terbuka sejak awal tanpa biaya siluman.',
    'aboutSection.pillar2Title': 'Arsitek & Tim Berpengalaman',
    'aboutSection.pillar2Desc': 'Dikerjakan tenaga ahli bersertifikasi dengan jam terbang tinggi di Jawa Timur.',
    'aboutSection.pillar3Title': 'Pengawasan Konstruksi Berkala',
    'aboutSection.pillar3Desc': 'Laporan opname fisik berkala dan garansi masa pemeliharaan resmi.',
    'aboutSection.ctaWhatsApp': 'Konsultasi Cepat via WhatsApp',
    'aboutSection.ctaMore': 'Pelajari Selengkapnya',

    // Services Section
    'servicesSection.badge': 'Layanan Kami',
    'servicesSection.title': 'Pelayanan Terbaik Untuk Anda',
    'servicesSection.desc':
      'Solusi lengkap konstruksi dan interior dari perencanaan hingga eksekusi, dengan standar profesional dan jaminan kualitas.',
    'servicesSection.s1Title': 'Konstruksi',
    'servicesSection.s1Desc':
      'Pembangunan rumah tinggal, gedung kantor, pergudangan, sekolah, hingga klinik kesehatan dengan pengawasan profesional.',
    'servicesSection.s2Title': 'Interior & Kitchen Set',
    'servicesSection.s2Desc':
      'Desain dan pembuatan kitchen set, backdrop, kabinet, wardrobe, plafond, hingga custom furniture sesuai kebutuhan.',
    'servicesSection.s3Title': 'Perumahan & Developer',
    'servicesSection.s3Desc':
      'Pembangunan unit perumahan, ruko komersial, kavling siap bangun, serta infrastruktur lingkungan perumahan.',
    'servicesSection.s4Title': 'Arsitektur & 3D',
    'servicesSection.s4Desc':
      'Jasa gambar kerja teknis (DED), visualisasi 3D photorealistic, siteplan, perhitungan struktur, dan simulasi MEP.',
    'servicesSection.s5Title': 'Renovasi Bangunan',
    'servicesSection.s5Desc':
      'Renovasi total maupun parsial, penambahan lantai (dak cor), perbaikan atap bocor, dan peremajaan fasad bangunan.',
    'servicesSection.s6Title': 'Waterproofing',
    'servicesSection.s6Desc':
      'Aplikasi membran bakar, coating elastomeric, dan injeksi beton bergaransi untuk mengatasi rembesan lantai dak dan dinding.',

    // Project Slider Section
    'projectSlider.badge': 'Hasil Karya Terbaru',
    'projectSlider.title': 'Karya & Realisasi Konstruksi',
    'projectSlider.desc':
      'Dokumentasi proyek konstruksi hunian, villa tropis, interior komersial, dan kitchen set yang telah kami selesaikan dengan mutu bergaransi.',
    'projectSlider.viewAll': 'Lihat Semua Portofolio',
    'projectSlider.prev': 'Project Sebelumnya',
    'projectSlider.next': 'Project Berikutnya',

    // Counter Section
    'counterSection.badge': 'Rekam Jejak & Kapabilitas',
    'counterSection.title': 'Dedikasi Konstruksi dalam',
    'counterSection.titleAccent': 'Angka Nyata',
    'counterSection.desc':
      'Bukti rekam jejak profesionalisme, ketepatan estimasi RAB, dan jaminan mutu konstruksi bergaransi resmi di Malang dan seluruh Jawa Timur.',
    'counterSection.stat1Label': 'Proyek Selesai',
    'counterSection.stat1Detail': 'Rumah, Villa & Gedung Komersial',
    'counterSection.stat2Label': 'Dedikasi & Pengalaman',
    'counterSection.stat2Detail': 'Arsitektur & Teknik Sipil Mandiri',
    'counterSection.stat3Label': 'Legalitas & SPK Resmi',
    'counterSection.stat3Detail': 'Transparansi RAB & Garansi BAST',
    'counterSection.stat4Label': 'Proyek Berjalan',
    'counterSection.stat4Detail': 'Aktif di Malang & Jawa Timur',

    // Why Choose Us Section
    'whyUs.badge': 'Kenapa Memilih Kami',
    'whyUs.title': 'Kenapa Harus Kami?',
    'whyUs.desc':
      'Dedikasi kami mengutamakan transparansi anggaran, legalitas kontrak resmi, dan standar mutu arsitektural untuk keamanan investasi Anda.',
    'whyUs.card1Title': 'Berpengalaman',
    'whyUs.card1Desc': 'Ditangani tim berpengalaman lebih dari 10 Tahun dengan track record 162+ proyek sukses.',
    'whyUs.card2Title': 'Solutif & Presisi',
    'whyUs.card2Desc':
      'Eksplorasi desain fungsional yang adaptif terhadap iklim tropis lokal dan kebutuhan riil tata ruang keluarga Anda.',
    'whyUs.card3Title': 'Amanah & Transparan',
    'whyUs.card3Desc':
      'Terbukti menyelesaikan 162+ proyek di Malang Raya tanpa sengketa, dengan laporan progres berkala dan rincian RAB terbuka.',
    'whyUs.card4Title': 'Jaminan Mutu & Garansi',
    'whyUs.card4Desc':
      'Garansi pemeliharaan fisik pasca-serah terima kunci (BAST) untuk memastikan ketenangan pikiran Anda.',
    'whyUs.sidebarBadge': 'STANDAR MUTU',
    'whyUs.sidebarTitle': 'Komitmen Mutu & Keamanan Investasi',
    'whyUs.tableHeadItem': 'Poin Komitmen',
    'whyUs.tableHeadBina': 'Bina Project',
    'whyUs.tableHeadOthers': 'Lainnya',
    'whyUs.point1': 'RAB Transparan',
    'whyUs.point1Val': 'Rinci per item pekerjaan',
    'whyUs.point1Other': 'Global tanpa detail',
    'whyUs.point2': 'Kontrak Legal (SPK)',
    'whyUs.point2Val': 'Resmi & mengikat hukum',
    'whyUs.point2Other': 'Seringkali lisan / informal',
    'whyUs.point3': 'Garansi Pemeliharaan',
    'whyUs.point3Val': 'Tertulis dalam kontrak',
    'whyUs.point3Other': 'Tanpa jaminan tertulis',
    'whyUs.point4': 'Pengawasan Arsitek',
    'whyUs.point4Val': 'Supervisi rutin berkala',
    'whyUs.point4Other': 'Hanya diserahkan tukang',

    // Process Section
    'process.badge': 'Alur Kerja Profesional',
    'process.title': '4 Tahap Pembangunan',
    'process.titleAccent': 'Rumah Impian Anda',
    'process.desc':
      'Transparan, terukur, dan terjadwal dari tahap konsultasi hingga serah terima kunci bergaransi.',
    'process.step1Title': 'Survei & Analisis Lokasi',
    'process.step1Desc':
      'Pengukuran akurat dimensi lahan, elevasi kontur tanah, orientasi arah mata angin, dan diskusi mendalam kebutuhan tata ruang.',
    'process.step1Deliv': 'Data kontur, foto eksisting, & resume kebutuhan ruang',
    'process.step2Title': 'Desain 3D & RAB Transparan',
    'process.step2Desc':
      'Visualisasi denah arsitektur 3D photorealistic interaktif dan rincian anggaran biaya (RAB) terbuka tanpa biaya siluman.',
    'process.step2Deliv': 'Gambar 3D render, denah arsitektur, & dokumen RAB',
    'process.step3Title': 'Pembangunan & Supervisi',
    'process.step3Desc':
      'Pengerjaan fisik oleh tim tukang profesional dengan supervisi rutin arsitek & project manager serta laporan berkala.',
    'process.step3Deliv': 'Laporan opname mingguan & dokumentasi foto/video',
    'process.step4Title': 'Serah Terima Kunci & Garansi',
    'process.step4Desc':
      'Pemeriksaan bersama (joint inspection), penandatanganan Berita Acara Serah Terima (BAST), dan penyerahan sertifikat garansi.',
    'process.step4Deliv': 'Kunci bangunan, dokumen BAST, & sertifikat garansi',

    // Consultation CTA Section
    'consultationCta.badge': 'Konsultasi & Estimasi RAB',
    'consultationCta.title': 'Rencanakan Bangunan Impian Tanpa Khawatir Biaya Membengkak',
    'consultationCta.desc':
      'Konsultasikan desain 3D, pemilihan material SNI, serta estimasi anggaran biaya (RAB) terbuka langsung bersama tim arsitek & project manager Bina Project.',
    'consultationCta.btnWa': 'Konsultasi Cepat via WhatsApp',
    'consultationCta.btnSurvey': 'Jadwalkan Survei Lokasi',

    // Testimonials
    'testimonials.badge': 'Testimonial Klien',
    'testimonials.title': 'Apa Kata Klien Bina Project?',
    'testimonials.desc':
      'Kepuasan dan kepercayaan Anda adalah prioritas utama dari setiap karya konstruksi & desain kami.',

    // Brand Marquee
    'brandMarquee.badge': 'Kolaborasi & Kemitraan',
    'brandMarquee.title': 'Partner Terpercaya Kami',
    'brandMarquee.desc':
      'Dipercaya oleh berbagai instansi BUMN, institusi kesehatan, perusahaan, dan pemilik hunian di seluruh Indonesia.',

    // FAQ Section
    'faq.badge': 'Pusat Bantuan & Tanya Jawab',
    'faq.title': 'Pertanyaan yang',
    'faq.titleAccent': 'Sering Diajukan',
    'faq.desc':
      'Jawaban transparan & lengkap seputar estimasi biaya RAB, tahapan proyek, spesifikasi material, dan garansi resmi layanan Bina Project di Malang & Jawa Timur.',
    'faq.searchPlaceholder': 'Ketik kata kunci... contoh: RAB, survei, garansi, kitchen set',
    'faq.questionsCount': 'Pertanyaan',
    'faq.allCategories': 'Semua Kategori',

    // About Page
    'about.title': 'Tentang Bina Project Studio',
    'about.subtitle':
      'Perjalanan, dedikasi, dan standar profesionalisme dalam setiap karya arsitektur dan konstruksi fisik.',
    'about.missionBadge': 'VISI & MISI KAMI',
    'about.missionTitle': 'Membangun Masa Depan dengan Mutu Tertinggi',
    'about.teamTitle': 'Tim Arsitek & Manajemen Proyek',
    'about.teamSubtitle': 'Tenaga ahli bersertifikasi yang berdedikasi mewujudkan standar bangunan presisi.',

    // Portfolio Page & Card
    'portfolio.title': 'Katalog Karya Arsitektur & Interior',
    'portfolio.subtitle':
      'Kumpulan portofolio proyek konstruksi rumah tinggal, renovasi komersial, villa, dan interior kustom.',
    'portfolio.filterAll': 'Semua',
    'portfolio.filterConstruction': 'Konstruksi',
    'portfolio.filterInterior': 'Interior & Furniture',
    'portfolio.filterRenovation': 'Renovasi',
    'portfolio.viewDetail': 'Lihat Detail Proyek',
    'projectCard.viewProject': 'Lihat Proyek',
    'projectCard.zoomPhoto': 'Perbesar Foto',

    // Project Detail Page
    'projectDetail.client': 'Klien:',
    'projectDetail.category': 'Kategori:',
    'projectDetail.date': 'Tanggal Projek:',
    'projectDetail.location': 'Lokasi:',
    'projectDetail.visualDoc': 'Dokumentasi Visual',
    'projectDetail.galleryTitle': 'Galeri Hasil Pengerjaan',
    'projectDetail.photoCount': 'Foto Dokumentasi',
    'projectDetail.readyToBuild': 'Siap Mewujudkan Bangunan Serupa?',
    'projectDetail.readyDesc':
      'Diskusikan konsep desain, estimasi anggaran biaya (RAB), dan survei lokasi langsung bersama arsitek Bina Project.',

    // Articles / Blog
    'blog.badge': 'Blog & Inspirasi',
    'blog.title': 'Tips & Tren Desain Masa Kini',
    'blog.desc':
      'Kumpulan artikel edukasi, tren desain arsitektur modern, dan panduan konstruksi dari tim ahli Bina Project.',
    'blog.readMore': 'BACA SELENGKAPNYA',
    'blog.emptyTitle': 'Belum Ada Artikel Tersedia',
    'blog.emptyDesc':
      'Tim kami sedang menyusun artikel edukatif dan tren desain arsitektur terbaru. Nantikan update tulisan menarik kami segera.',

    // Contact Page
    'contact.title': 'Mulai Konsultasi Rencana Bangunan Anda',
    'contact.subtitle':
      'Konsultasikan kebutuhan desain arsitektur, rencana anggaran biaya (RAB), dan survei lokasi langsung tanpa biaya awal.',
    'contact.formName': 'Nama Lengkap',
    'contact.formPhone': 'Nomor WhatsApp Aktif',
    'contact.formService': 'Kategori Layanan',
    'contact.formCity': 'Lokasi Proyek / Kota',
    'contact.formBudget': 'Estimasi Anggaran',
    'contact.formNotes': 'Ceritakan Rencana Bangunan Anda',
    'contact.formSubmit': 'KIRIM PERMINTAAN KONSULTASI',
    'contact.address': 'Alamat Kantor Studio',
    'contact.phone': 'Telepon / WhatsApp',
    'contact.email': 'Email Resmi',
    'contact.hours': 'Jam Operasional',

    // Floating WhatsApp
    'floatingWa.label': 'Konsultasi Gratis',
    'floatingWa.msgDefault':
      'Halo Tim Bina Project, saya ingin konsultasi rencana proyek konstruksi & desain interior.',

    // Breadcrumb
    'breadcrumb.home': 'Beranda',

    // SideMenu
    'sidemenu.badge': 'Studio Arsitektur & Kontraktor',
    'sidemenu.contactInfo': 'Informasi Kontak',
    'sidemenu.address': 'Alamat Kantor',
    'sidemenu.hotline': 'WhatsApp Hotline',
    'sidemenu.hours': 'Jam Operasional',
    'sidemenu.hoursVal': 'Senin - Sabtu: 08.00 - 17.00 WIB',
    'sidemenu.hoursSun': 'Minggu: Janji Temu',
    'sidemenu.contactUs': 'Hubungi Kami',

    // Footer
    'footer.about':
      'Studio perencanaan arsitektur, kontraktor bangunan rumah modern, dan interior estetik profesional berpusat di Malang, Jawa Timur.',
    'footer.quickLinks': 'Tautan Cepat',
    'footer.services': 'Layanan Konstruksi',
    'footer.rights': 'Seluruh Hak Cipta Dilindungi.',
    'footer.ctaTitle': 'Siap Mewujudkan Bangunan & Interior Impian Anda?',
    'footer.ctaDesc':
      'Diskusikan konsep desain, survei lokasi lahan, dan estimasi anggaran biaya (RAB) tanpa komitmen di awal bersama arsitek kami.',
    'footer.ctaButton': 'KONSULTASI VIA WHATSAPP',
    'footer.officeHoursTitle': 'Jam Operasional Kantor',
    'footer.officeHoursDays': 'Senin - Sabtu: 08.00 - 16.00 WIB',
    'footer.officeHoursHolidays': 'Minggu & Hari Libur: Sesuai Perjanjian',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.portfolio': 'Portfolio',
    'nav.liveProjects': 'Live Projects',
    'nav.articles': 'Articles',
    'nav.contact': 'Contact Us',

    // Call To Action
    'cta.consultation': 'FREE CONSULTATION',
    'cta.contactUs': 'Contact Us',
    'cta.viewAllProjects': 'View All Projects',
    'cta.askSimilarProject': 'Inquire Similar Project',
    'cta.exploreServices': 'Explore Services',

    // Site Identity & Meta
    'site.name': 'Bina Project',
    'site.tagline': 'Architectural Construction & Interior Design Malang',
    'site.description':
      'Premier architectural construction, residential renovations, bespoke interior design & custom kitchen sets in Malang & East Java. Fully guaranteed with free on-site survey.',

    // Hero Section
    'hero.badge': 'PROFESSIONAL ARCHITECTURE & CONTRACTOR',
    'hero.titlePrefix': 'Crafting Your Dream Spaces with',
    'hero.titleHighlight': 'Peak Precision & Aesthetics',
    'hero.subtitle':
      'Integrated turnkey solutions for modern residential construction, architectural renovations, and luxury interiors in Malang & East Java. Guaranteed, transparent, on schedule.',
    'hero.statProjects': 'Projects Successfully Completed',
    'hero.statSatisfaction': 'Client Satisfaction Rate',
    'hero.statWarranty': 'Maintenance Warranty',

    // Live Projects Map
    'map.hudBadge': 'LIVE ON-GOING PROJECTS',
    'map.activeCount': 'Active Projects In Progress',
    'map.filterAll': 'All Projects',
    'map.filterConstruction': 'New Construction',
    'map.filterRenovation': 'Renovation',
    'map.filterInterior': 'Interior',
    'map.statusOngoing': 'In Progress',
    'map.statusFinishing': 'Finishing Phase',
    'map.statusStructural': 'Structural Phase',
    'map.statusPreparation': 'Site Preparation',
    'map.progress': 'Progress',
    'map.targetCompletion': 'Target Completion',
    'map.contractor': 'Site Contractor',
    'map.architect': 'Supervising Architect',
    'map.documentation': 'Field Documentation',
    'map.noDocumentation': 'No visual documentation uploaded yet',

    // About Section (Homepage)
    'aboutSection.badge': 'About Our Studio',
    'aboutSection.title': 'You Dream It, We Build It',
    'aboutSection.desc':
      'Your trusted partner for residential homes and commercial premises. From 3D architectural plans to turnkey construction with professional engineering standards, transparent BOQ, and official legal contracts.',
    'aboutSection.proof1Title': '10+ Years Dedication',
    'aboutSection.proof1Sub': 'Licensed Architects & Certified Engineers',
    'aboutSection.proof2Label': 'Completed Projects',
    'aboutSection.proof2Verified': '100% Contractual Completion',
    'aboutSection.pillar1Title': 'Transparent & Binding BOQ',
    'aboutSection.pillar1Desc': 'Clear material specifications and honest cost breakdown with zero hidden fees.',
    'aboutSection.pillar2Title': 'Licensed Architects & Master Craftsmen',
    'aboutSection.pillar2Desc': 'Executed by certified site supervisors and master craftsmen across East Java.',
    'aboutSection.pillar3Title': 'Supervised Site Management',
    'aboutSection.pillar3Desc': 'Regular progress reports and comprehensive post-handover structural warranty.',
    'aboutSection.ctaWhatsApp': 'WhatsApp Consultation',
    'aboutSection.ctaMore': 'Learn More About Us',

    // Services Section
    'servicesSection.badge': 'Our Services',
    'servicesSection.title': 'Premier Architectural & Building Solutions',
    'servicesSection.desc':
      'Turnkey construction and interior solutions from initial planning to physical execution, backed by professional engineering standards.',
    'servicesSection.s1Title': 'General Construction',
    'servicesSection.s1Desc':
      'Turnkey construction of residential estates, commercial offices, warehouses, and medical clinics under licensed supervision.',
    'servicesSection.s2Title': 'Bespoke Interior & Kitchens',
    'servicesSection.s2Desc':
      'Custom kitchen sets, wardrobes, living room backdrop, architectural ceiling work, and bespoke furniture tailored to your lifestyle.',
    'servicesSection.s3Title': 'Housing & Development',
    'servicesSection.s3Desc':
      'Residential housing developments, commercial shophouses, and masterplanned residential infrastructure.',
    'servicesSection.s4Title': 'Architectural Design & 3D',
    'servicesSection.s4Desc':
      'Detailed engineering drawings (DED), photorealistic 3D rendering, site planning, and MEP analysis.',
    'servicesSection.s5Title': 'Structural Renovation',
    'servicesSection.s5Desc':
      'Total or partial renovations, vertical building expansions, roof waterproofing, and facade modernization.',
    'servicesSection.s6Title': 'Specialist Waterproofing',
    'servicesSection.s6Desc':
      'Torch-on membrane, elastomeric coatings, and polyurethane crack injection with guaranteed protection.',

    // Project Slider Section
    'projectSlider.badge': 'Recent Projects',
    'projectSlider.title': 'Featured Construction Works',
    'projectSlider.desc':
      'Photographic portfolio of residential homes, tropical villas, commercial interiors, and kitchen sets completed with warranty.',
    'projectSlider.viewAll': 'View All Portfolio',
    'projectSlider.prev': 'Previous Project',
    'projectSlider.next': 'Next Project',

    // Counter Section
    'counterSection.badge': 'Proven Track Record',
    'counterSection.title': 'Construction Craftsmanship in',
    'counterSection.titleAccent': 'Real Numbers',
    'counterSection.desc':
      'Measurable proof of architectural excellence, budget precision, and guaranteed structural quality across East Java.',
    'counterSection.stat1Label': 'Projects Completed',
    'counterSection.stat1Detail': 'Homes, Villas & Commercial Buildings',
    'counterSection.stat2Label': 'Years of Craftsmanship',
    'counterSection.stat2Detail': 'In-house Architecture & Civil Engineering',
    'counterSection.stat3Label': 'Official Legal Contract',
    'counterSection.stat3Detail': 'Transparent BOQ & Warranty Handover',
    'counterSection.stat4Label': 'Active Site Locations',
    'counterSection.stat4Detail': 'Across Greater Malang & East Java',

    // Why Choose Us Section
    'whyUs.badge': 'Why Choose Us',
    'whyUs.title': 'Why Build With Bina Project?',
    'whyUs.desc':
      'Our studio prioritizes budget integrity, official contract guarantees, and superior architectural craftsmanship for your investment security.',
    'whyUs.card1Title': 'Over a Decade of Experience',
    'whyUs.card1Desc': 'Managed by a licensed team with over 10 years of experience and 162+ verified projects.',
    'whyUs.card2Title': 'Adaptive & Precision-Driven',
    'whyUs.card2Desc':
      'Functional design exploration tailored to the local tropical climate and modern living requirements.',
    'whyUs.card3Title': 'Transparent & Accountable',
    'whyUs.card3Desc':
      'Proven track record of zero legal disputes, backed by periodic opname reporting and open-book BOQ.',
    'whyUs.card4Title': 'Quality Assurance & Warranty',
    'whyUs.card4Desc':
      'Formal post-handover maintenance warranty to ensure enduring peace of mind.',
    'whyUs.sidebarBadge': 'QUALITY STANDARDS',
    'whyUs.sidebarTitle': 'Quality Commitment & Investment Safety',
    'whyUs.tableHeadItem': 'Commitment Point',
    'whyUs.tableHeadBina': 'Bina Project',
    'whyUs.tableHeadOthers': 'Others',
    'whyUs.point1': 'Open-Book BOQ',
    'whyUs.point1Val': 'Itemized breakdown per trade',
    'whyUs.point1Other': 'Lump sum without details',
    'whyUs.point2': 'Legal Contract (SPK)',
    'whyUs.point2Val': 'Official & legally binding',
    'whyUs.point2Other': 'Often verbal or informal',
    'whyUs.point3': 'Maintenance Warranty',
    'whyUs.point3Val': 'Contractually guaranteed',
    'whyUs.point3Other': 'No formal written warranty',
    'whyUs.point4': 'Architectural Supervision',
    'whyUs.point4Val': 'Periodic on-site supervision',
    'whyUs.point4Other': 'Left entirely to subcontractors',

    // Process Section
    'process.badge': 'Professional Workflow',
    'process.title': '4 Steps to Building',
    'process.titleAccent': 'Your Dream Home',
    'process.desc':
      'Transparent, measurable, and scheduled from initial consultation to turnkey handover with warranty.',
    'process.step1Title': 'On-Site Survey & Land Analysis',
    'process.step1Desc':
      'Accurate boundary measurements, contour elevation analysis, sun path orientation, and spatial needs analysis.',
    'process.step1Deliv': 'Site contour data, existing photos, & spatial brief',
    'process.step2Title': '3D Architectural Design & BOQ',
    'process.step2Desc':
      'Photorealistic 3D architectural rendering and transparent itemized bill of quantities with zero hidden costs.',
    'process.step2Deliv': '3D renders, architectural plans, & itemized BOQ',
    'process.step3Title': 'Construction & Site Supervision',
    'process.step3Desc':
      'Physical execution by seasoned craftsmen under strict supervision of project managers with periodic progress reports.',
    'process.step3Deliv': 'Weekly physical reports & site photo/video logs',
    'process.step4Title': 'Key Handover & Formal Warranty',
    'process.step4Desc':
      'Joint inspection, signing of the Handover Deed (BAST), and issuance of the official structural warranty.',
    'process.step4Deliv': 'Building keys, BAST document, & warranty certificate',

    // Consultation CTA Section
    'consultationCta.badge': 'Consultation & Cost Estimation',
    'consultationCta.title': 'Plan Your Dream Building with Absolute Budget Certainty',
    'consultationCta.desc':
      'Discuss photorealistic 3D plans, premium certified materials, and transparent cost estimates directly with our architects & project managers.',
    'consultationCta.btnWa': 'Fast WhatsApp Consultation',
    'consultationCta.btnSurvey': 'Schedule a Site Survey',

    // Testimonials
    'testimonials.badge': 'Client Testimonials',
    'testimonials.title': 'What Our Clients Say',
    'testimonials.desc':
      'Client satisfaction and enduring trust are the ultimate measures of our craftsmanship.',

    // Brand Marquee
    'brandMarquee.badge': 'Collaboration & Partners',
    'brandMarquee.title': 'Our Trusted Partners',
    'brandMarquee.desc':
      'Trusted by leading corporate institutions, medical facilities, commercial enterprises, and private homeowners across Indonesia.',

    // FAQ Section
    'faq.badge': 'Help Center & FAQ',
    'faq.title': 'Frequently Asked',
    'faq.titleAccent': 'Questions',
    'faq.desc':
      'Comprehensive answers regarding cost estimation, construction phases, material specifications, and formal warranty protection in Malang & East Java.',
    'faq.searchPlaceholder': 'Type keyword... e.g. cost estimate, survey, warranty, interior',
    'faq.questionsCount': 'Questions',
    'faq.allCategories': 'All Categories',

    // About Page
    'about.title': 'About Bina Project Studio',
    'about.subtitle':
      'Our journey, architectural craftsmanship, and unrelenting dedication to structural excellence.',
    'about.missionBadge': 'OUR VISION & MISSION',
    'about.missionTitle': 'Building the Future with the Highest Quality Standards',
    'about.teamTitle': 'Architectural Team & Project Management',
    'about.teamSubtitle': 'Certified professionals committed to engineering precision and architectural elegance.',

    // Portfolio Page & Card
    'portfolio.title': 'Architecture & Interior Catalog',
    'portfolio.subtitle':
      'Curated showcase of residential buildings, commercial spaces, contemporary villas, and bespoke interiors.',
    'portfolio.filterAll': 'All',
    'portfolio.filterConstruction': 'Construction',
    'portfolio.filterInterior': 'Interior & Furniture',
    'portfolio.filterRenovation': 'Renovation',
    'portfolio.viewDetail': 'View Project Details',
    'projectCard.viewProject': 'View Project',
    'projectCard.zoomPhoto': 'Enlarge Photo',

    // Project Detail Page
    'projectDetail.client': 'Client:',
    'projectDetail.category': 'Category:',
    'projectDetail.date': 'Project Date:',
    'projectDetail.location': 'Location:',
    'projectDetail.visualDoc': 'Visual Documentation',
    'projectDetail.galleryTitle': 'Craftsmanship Gallery',
    'projectDetail.photoCount': 'Project Photos',
    'projectDetail.readyToBuild': 'Ready to Build a Similar Project?',
    'projectDetail.readyDesc':
      'Discuss your design concept, cost estimations (BOQ/RAB), and on-site survey directly with Bina Project architects.',

    // Articles / Blog
    'blog.badge': 'Blog & Design Insights',
    'blog.title': 'Architectural Trends & Design Guides',
    'blog.desc':
      'Educational articles, modern architectural design trends, and construction guidelines from our specialist team.',
    'blog.readMore': 'READ ARTICLE',
    'blog.emptyTitle': 'No Articles Published Yet',
    'blog.emptyDesc':
      'Our editorial team is preparing educational articles and architectural design trends. Check back soon for new insights.',

    // Contact Page
    'contact.title': 'Start Your Architectural Consultation',
    'contact.subtitle':
      'Consult your architectural vision, budget estimations (BOQ/RAB), and schedule an on-site survey with no upfront fees.',
    'contact.formName': 'Full Name',
    'contact.formPhone': 'Active WhatsApp / Phone',
    'contact.formService': 'Service Category',
    'contact.formCity': 'Project Location / City',
    'contact.formBudget': 'Estimated Budget',
    'contact.formNotes': 'Tell Us About Your Project',
    'contact.formSubmit': 'SEND CONSULTATION REQUEST',
    'contact.address': 'Studio Office Address',
    'contact.phone': 'Phone / WhatsApp',
    'contact.email': 'Official Email',
    'contact.hours': 'Operating Hours',

    // Floating WhatsApp
    'floatingWa.label': 'Free Consultation',
    'floatingWa.msgDefault':
      'Hello Bina Project Team, I would like to consult on architectural construction & interior design plans.',

    // Breadcrumb
    'breadcrumb.home': 'Home',

    // SideMenu
    'sidemenu.badge': 'Architectural Studio & Contractor',
    'sidemenu.contactInfo': 'Contact Information',
    'sidemenu.address': 'Studio Office Address',
    'sidemenu.hotline': 'WhatsApp Hotline',
    'sidemenu.hours': 'Business Hours',
    'sidemenu.hoursVal': 'Monday - Saturday: 08:00 - 17:00 WIB',
    'sidemenu.hoursSun': 'Sunday: By Appointment',
    'sidemenu.contactUs': 'Contact Us',

    // Footer
    'footer.about':
      'Official architectural planning studio, modern residential general contractor, and bespoke luxury interior design atelier based in Malang, East Java.',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Construction Services',
    'footer.rights': 'All Rights Reserved.',
    'footer.ctaTitle': 'Ready to Bring Your Architectural & Interior Vision to Life?',
    'footer.ctaDesc':
      'Discuss design concepts, site surveys, and cost estimations (BOQ/RAB) with zero initial commitment alongside our lead architects.',
    'footer.ctaButton': 'WHATSAPP CONSULTATION',
    'footer.officeHoursTitle': 'Studio Business Hours',
    'footer.officeHoursDays': 'Monday - Saturday: 08:00 - 16:00 WIB',
    'footer.officeHoursHolidays': 'Sunday & Holidays: By Appointment',
  },
} as const;

export type TranslationKey = keyof typeof ui[typeof defaultLang];
