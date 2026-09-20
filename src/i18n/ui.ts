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
    'nav.home': 'Beranda',
    'nav.about': 'Tentang Kami',
    'nav.portfolio': 'Portfolio',
    'nav.liveProjects': 'Proyek Berjalan',
    'nav.articles': 'Artikel',
    'nav.contact': 'Kontak Kami',

    // Top Bar
    'topbar.chatOnly': '(Chat Only)',
    'topbar.tagline': 'KONTRAKTOR SURABAYA MALANG',

    // Call To Action
    'cta.consultation': 'Konsultasi & Kerjasama',
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
    'map.filterConstruction': 'Konstruksi',
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
    'aboutSection.title': 'Solusi Aman Membangun Ruang Impian',
    'aboutSection.desc':
      'Perusahaan profesional yang bergerak di bidang desain perencanaan, kontraktor interior, kontraktor konstruksi dan waterproofing dengan garansi',
    'aboutSection.proof1Title': '10+ Tahun Dedikasi',
    'aboutSection.proof1Sub': 'Arsitek & Tenaga Ahli Bersertifikasi',
    'aboutSection.proof2Label': 'Projek Sukses Selesai',
    'aboutSection.proof2Verified': '100% Tuntas Sesuai SPK',
    'aboutSection.pillar1Title': 'Tim Berkompeten',
    'aboutSection.pillar1Desc': 'Ditangani oleh tim yang berpengalaman dan bersertifikasi.',
    'aboutSection.pillar2Title': 'Bergaransi',
    'aboutSection.pillar2Desc': 'Setiap proyek terikat kontrak kerja resmi (SPK) dengan jaminan masa pemeliharaan terpercaya.',
    'aboutSection.pillar3Title': 'Lebih Rapi',
    'aboutSection.pillar3Desc': 'Jaminan lebih rapi dalam setiap hasil pengerjaan dan ditangani oleh Tim berpengalaman sehingga selalu mendapatkan solusi dari setiap kendala yang ada.',
    'aboutSection.pillar4Title': 'Pemeliharaan Berkelanjutan',
    'aboutSection.pillar4Desc': 'Menyediakan layanan pemeliharaan berkelanjutan pasca masa pemeliharaan selesai.',
    'aboutSection.ctaWhatsApp': 'Konsultasi Cepat via WhatsApp',
    'aboutSection.ctaMore': 'Pelajari Selengkapnya',

    // Services Section
    'servicesSection.badge': 'Layanan Kami',
    'servicesSection.title': 'Pelayanan Terbaik Untuk Anda',
    'servicesSection.desc':
      'Solusi lengkap konstruksi dan interior dari perencanaan hingga eksekusi, dengan standar profesional dan jaminan kualitas.',
    'servicesSection.s1Title': 'Gambar Perencanaan',
    'servicesSection.s1Desc':
      'Penyusunan gambar kerja arsitektur lengkap (DED), denah tata ruang, visualisasi 3D fasad, dan detail teknis MEP.',
    'servicesSection.s2Title': 'Gambar Siteplan Kawasan',
    'servicesSection.s2Desc':
      'Perencanaan masterplan zonasi lahan, jaringan utilitas, aksesibilitas jalan, dan penataan lanskap kawasan terpadu.',
    'servicesSection.s3Title': 'Pembuatan RAB',
    'servicesSection.s3Desc':
      'Rencana Anggaran Biaya transparan, rincian volume material detail, dan analisis harga satuan tanpa biaya siluman.',
    'servicesSection.s4Title': 'Uji Tanah Geolistrik',
    'servicesSection.s4Desc':
      'Investigasi geolistrik dan pengujian sondir untuk memetakan daya dukung tanah serta potensi air tanah secara akurat.',
    'servicesSection.s5Title': 'Perhitungan Struktur',
    'servicesSection.s5Desc':
      'Kalkulasi rekayasa struktur beton dan baja bertulang berstandar SNI untuk keamanan gempa dan ketahanan maksimal.',
    'servicesSection.s6Title': 'Renovasi Rumah Tinggal/Gedung Bertingkat',
    'servicesSection.s6Desc':
      'Renovasi total maupun parsial, penambahan lantai (dak cor), penguatan struktur, serta peremajaan fasad bangunan modern.',
    'servicesSection.s7Title': 'Pembangunan Kawasan Perumahan/Komersial',
    'servicesSection.s7Desc':
      'Pembangunan klaster perumahan, ruko komersial, pergudangan, dan fasilitas publik dari fondasi hingga serah terima SPK.',
    'servicesSection.s8Title': 'Perbaikan Kebocoran',
    'servicesSection.s8Desc':
      'Identifikasi sumber kebocoran atap dak, talang beton, dinding rembes, serta perbaikan sistematis dengan garansi tuntas.',
    'servicesSection.s9Title': 'Pekerjaan Waterproofing',
    'servicesSection.s9Desc':
      'Aplikasi membran bakar, coating elastomeric, dan injeksi polyurethane (PU) bergaransi untuk perlindungan anti bocor permanen.',
    'servicesSection.s10Title': 'Pengurusan PBG/SLF',
    'servicesSection.s10Desc':
      'Pendampingan legalitas izin Persetujuan Bangunan Gedung (PBG) dan Sertifikat Laik Fungsi (SLF) resmi sesuai regulasi dinas.',
    'servicesSection.s11Title': 'Pembuatan Maket',
    'servicesSection.s11Desc':
      'Miniatur arsitektur 3D presisi berskala realistis untuk visualisasi proyek perumahan, gedung, dan display pameran.',

    // Project Slider Section
    'projectSlider.badge': 'Hasil Karya Terbaru',
    'projectSlider.title': 'Portofolio Kami',
    'projectSlider.desc':
      'Dokumentasi proyek konstruksi hunian, villa tropis, interior komersial, dan kitchen set yang telah kami selesaikan dengan mutu bergaransi.',
    'projectSlider.viewAll': 'Lihat Semua Portofolio',
    'projectSlider.prev': 'Project Sebelumnya',
    'projectSlider.next': 'Project Berikutnya',

    // Counter Section
    'counterSection.badge': 'Rekam Jejak & Kapabilitas',
    'counterSection.title': 'Dedikasi Kami dalam',
    'counterSection.titleAccent': 'Angka Nyata',
    'counterSection.desc':
      'Bukti rekam jejak profesionalisme, ketepatan estimasi RAB, dan jaminan mutu konstruksi karya kami di seluruh Indonesia.',
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
    'process.title': '5 Tahap Pembangunan',
    'process.titleAccent': 'Ruang Impian Anda',
    'process.desc':
      'Transparan, terukur, dan terjadwal dari tahap konsultasi awal hingga serah terima kunci bergaransi.',
    'process.step1Title': 'Konsultasi',
    'process.step1Desc':
      'Diskusi mendalam membedah kebutuhan fungsi ruang, gaya arsitektur, preferensi tata letak, hingga estimasi awal anggaran bersama tim arsitek.',
    'process.step1Deliv': 'Design brief awal, resume kebutuhan ruang, & estimasi timeline',
    'process.step2Title': 'Survei & Analisis Lokasi',
    'process.step2Desc':
      'Pengukuran akurat dimensi lahan, elevasi kontur tanah, orientasi arah mata angin, dan diskusi mendalam kebutuhan tata ruang.',
    'process.step2Deliv': 'Data kontur, foto eksisting, & kajian kelayakan teknis lahan',
    'process.step3Title': 'Perancangan & Rencana Anggaran Biaya',
    'process.step3Desc':
      'Visualisasi denah arsitektur 3D photorealistic interaktif dan rincian anggaran biaya (RAB) terbuka tanpa biaya siluman.',
    'process.step3Deliv': 'Buku gambar kerja DED, visual 3D render, & dokumen RAB detail',
    'process.step4Title': 'Pembangunan & Pengawasan',
    'process.step4Desc':
      'Pengerjaan fisik oleh tim tukang profesional dengan supervisi rutin arsitek & project manager serta laporan berkala.',
    'process.step4Deliv': 'Laporan opname mingguan & dokumentasi foto/video WhatsApp',
    'process.step5Title': 'Serah Terima Kunci & Garansi',
    'process.step5Desc':
      'Pemeriksaan bersama (joint inspection), penandatanganan Berita Acara Serah Terima (BAST), dan penyerahan sertifikat garansi resmi.',
    'process.step5Deliv': 'Kunci bangunan, dokumen BAST, & sertifikat garansi pemeliharaan',

    // Consultation CTA Section
    'consultationCta.badge': 'Konsultasi & Estimasi RAB',
    'consultationCta.title': 'Rencanakan Ruang Impian Anda Tanpa Khawatir Biaya Membengkak',
    'consultationCta.desc':
      'Konsultasikan desain, konsep, serta estimasi biaya langsung bersama tim Bina Project.',
    'consultationCta.btnWa': 'Konsultasi via WhatsApp',
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
      'Dipercaya oleh berbagai Instansi, Lembaga dan Organisasi Lainnya di seluruh Indonesia.',

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

    // Team Section
    'team.badge': 'Tim & Kepemimpinan',
    'team.title': 'Dedikasi Profesional',
    'team.titleAccent': 'Dibalik Setiap Karya',
    'team.desc':
      'Setiap ruang yang kami bangun ditangani oleh tim berkompeten demi menjaga keamanan dan kepuasan konsumen.',

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
    'blog.title': 'Artikel Bina Project',
    'blog.desc':
      'Kumpulan artikel, berita, konten dan hal-hal yang berkaitan dengan desain properti interior konstruksi dan waterproofing.',
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
    'sidemenu.badge': 'Solusi Aman Membangun Ruang Impian',
    'sidemenu.desc':
      'Perusahaan profesional yang bergerak di bidang desain perencanaan, kontraktor interior, kontraktor konstruksi dan waterproofing dengan garansi',
    'sidemenu.contactInfo': 'Informasi Kontak',
    'sidemenu.address': 'Alamat',
    'sidemenu.hotline': 'WhatsApp',
    'sidemenu.email': 'Email',
    'sidemenu.hours': 'Jam Operasional',
    'sidemenu.hoursVal': 'Hari Senin – Sabtu: 08.00 - 16.00 WIB',
    'sidemenu.hoursSun': 'Hari Minggu / Tanggal Merah: Libur',
    'sidemenu.socialMedia': 'Media Sosial',
    'sidemenu.contactUs': 'Hubungi Kami',
    'sidemenu.ctaWhatsapp': 'KONSULTASI WHATSAPP',

    // Footer
    'footer.about':
      'Studio perencanaan arsitektur, kontraktor bangunan rumah modern, dan interior estetik profesional berpusat di Malang, Jawa Timur.',
    'footer.quickLinks': 'Tautan Cepat',
    'footer.services': 'Layanan Konstruksi',
    'footer.rights': 'Seluruh Hak Cipta Dilindungi.',
    'footer.ctaTitle': 'Siap Mewujudkan Ruang Impian Anda?',
    'footer.ctaDesc':
      'Diskusikan konsep desain, survei lokasi lahan, dan estimasi biaya tanpa komitmen di awal bersama tim kami.',
    'footer.ctaButton': 'KONSULTASI VIA WHATSAPP',
    'footer.officeHoursTitle': 'Jam Operasional',
    'footer.officeHoursDays': 'Senin - Sabtu: 08.00 - 16.00 WIB',
    'footer.officeHoursHolidays': 'Minggu / Tanggal Merah: Libur',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.portfolio': 'Portfolio',
    'nav.liveProjects': 'Live Projects',
    'nav.articles': 'Articles',
    'nav.contact': 'Contact Us',

    // Top Bar
    'topbar.chatOnly': '(Chat Only)',
    'topbar.tagline': 'KONTRAKTOR SURABAYA MALANG',

    // Call To Action
    'cta.consultation': 'Consultation & Cooperation',
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
    'map.filterConstruction': 'Construction',
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
    'aboutSection.badge': 'About Bina Project',
    'aboutSection.title': 'Safe Solutions to Build Your Dream Space',
    'aboutSection.desc':
      'A professional company specializing in architectural design planning, interior contracting, construction contracting, and guaranteed waterproofing.',
    'aboutSection.proof1Title': '10+ Years Dedication',
    'aboutSection.proof1Sub': 'Licensed Architects & Certified Engineers',
    'aboutSection.proof2Label': 'Completed Projects',
    'aboutSection.proof2Verified': '100% Completed According to SPK Contract',
    'aboutSection.pillar1Title': 'Competent Team',
    'aboutSection.pillar1Desc': 'Handled by an experienced and certified team.',
    'aboutSection.pillar2Title': 'Official Warranty',
    'aboutSection.pillar2Desc': 'Every project is bound by an official work contract (SPK) with a trusted maintenance warranty.',
    'aboutSection.pillar3Title': 'Neater Workmanship',
    'aboutSection.pillar3Desc': 'Guaranteed neater work in every project delivery, handled by experienced teams to always find solutions for any challenges.',
    'aboutSection.pillar4Title': 'Sustainable Maintenance',
    'aboutSection.pillar4Desc': 'Providing sustainable maintenance services after the initial maintenance period ends.',
    'aboutSection.ctaWhatsApp': 'Fast WhatsApp Consultation',
    'aboutSection.ctaMore': 'Learn More',

    // Services Section
    'servicesSection.badge': 'Our Services',
    'servicesSection.title': 'Premier Architectural & Building Solutions',
    'servicesSection.desc':
      'Turnkey construction and interior solutions from initial planning to physical execution, backed by professional engineering standards.',
    'servicesSection.s1Title': 'Architectural Planning',
    'servicesSection.s1Desc':
      'Comprehensive architectural working drawings (DED), functional floor plans, photorealistic 3D facades, and MEP details.',
    'servicesSection.s2Title': 'Master Site Plan Design',
    'servicesSection.s2Desc':
      'Integrated master planning for land zoning, utility networks, road accessibility, and sustainable landscape layouts.',
    'servicesSection.s3Title': 'BOQ & Cost Estimation (RAB)',
    'servicesSection.s3Desc':
      'Transparent bill of quantities (BOQ), detailed material takeoffs, and unit rate analysis with zero hidden costs.',
    'servicesSection.s4Title': 'Geoelectric Soil Investigation',
    'servicesSection.s4Desc':
      'Subsurface resistivity mapping and soil cone penetration tests to assess ground bearing capacity and groundwater tables.',
    'servicesSection.s5Title': 'Structural Engineering Calculations',
    'servicesSection.s5Desc':
      'Rigorous reinforced concrete and structural steel engineering calculations adhering to SNI seismic safety standards.',
    'servicesSection.s6Title': 'Residential & Multi-Story Renovation',
    'servicesSection.s6Desc':
      'Turnkey complete or partial renovations, vertical building expansions, structural reinforcement, and modern facade revamps.',
    'servicesSection.s7Title': 'Housing & Commercial Development',
    'servicesSection.s7Desc':
      'Turnkey development of residential clusters, commercial shophouses, warehouses, and infrastructure from foundation to handover.',
    'servicesSection.s8Title': 'Structural Leakage Repair',
    'servicesSection.s8Desc':
      'Precise diagnosis and systematic restoration of rooftop slab leaks, concrete gutters, and damp walls with official warranty.',
    'servicesSection.s9Title': 'Specialist Waterproofing Works',
    'servicesSection.s9Desc':
      'Application of torch-on membranes, elastomeric coatings, and polyurethane (PU) injection for permanent water barrier protection.',
    'servicesSection.s10Title': 'Building Approval & Permitting (PBG/SLF)',
    'servicesSection.s10Desc':
      'Complete professional assistance for official Building Approval (PBG) and Certificate of Functionality (SLF) compliance.',
    'servicesSection.s11Title': 'Architectural Scale Modeling',
    'servicesSection.s11Desc':
      'Precision 3D architectural scale models built to realistic proportions for property marketing, presentations, and exhibitions.',

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
      'Our dedication prioritizes budget transparency, official legal contracts, and architectural quality standards for your investment security.',
    'whyUs.card1Title': 'Experienced',
    'whyUs.card1Desc': 'Handled by an experienced team with over 10 years of dedication and a track record of 162+ successful projects.',
    'whyUs.card2Title': 'Solution-Oriented & Precise',
    'whyUs.card2Desc':
      'Functional design exploration adaptive to the local tropical climate and your family’s real spatial needs.',
    'whyUs.card3Title': 'Trustworthy & Transparent',
    'whyUs.card3Desc':
      'Proven to complete 162+ projects in Greater Malang with zero disputes, backed by periodic progress reports and open-book RAB.',
    'whyUs.card4Title': 'Quality Assurance & Warranty',
    'whyUs.card4Desc':
      'Physical maintenance warranty after key handover (BAST) to ensure your peace of mind.',
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
    'process.title': '5 Steps to Building',
    'process.titleAccent': 'Your Dream Space',
    'process.desc':
      'Transparent, measurable, and scheduled from initial consultation to turnkey handover with warranty.',
    'process.step1Title': 'Consultation',
    'process.step1Desc':
      'In-depth discussion exploring spatial functionality, architectural style, layout preferences, and initial budget estimations with the architect team.',
    'process.step1Deliv': 'Initial design brief, spatial needs summary, & preliminary timeline estimate',
    'process.step2Title': 'Site Survey & Location Analysis',
    'process.step2Desc':
      'Accurate land dimension measurement, soil contour elevation, wind/sun orientation, and in-depth spatial needs discussion.',
    'process.step2Deliv': 'Contour data, existing site photos, & technical feasibility report',
    'process.step3Title': 'Architectural Design & BOQ (RAB)',
    'process.step3Desc':
      'Interactive photorealistic 3D architectural floor plans and transparent itemized bill of quantities (RAB/BOQ) with zero hidden fees.',
    'process.step3Deliv': 'DED working drawing book, 3D visual renders, & detailed RAB document',
    'process.step4Title': 'Construction & Site Supervision',
    'process.step4Desc':
      'Physical execution by a professional craftsman team under periodic supervision of architects & project managers with regular updates.',
    'process.step4Deliv': 'Weekly milestone reports & WhatsApp photo/video updates',
    'process.step5Title': 'Key Handover & Formal Warranty',
    'process.step5Desc':
      'Joint inspection, signing of the Handover Deed (BAST), and delivery of the official maintenance warranty certificate.',
    'process.step5Deliv': 'Building keys, BAST document, & maintenance warranty certificate',

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

    // Team Section
    'team.badge': 'Team & Leadership',
    'team.title': 'Professional Dedication',
    'team.titleAccent': 'Behind Every Masterpiece',
    'team.desc':
      'Every space we build is handled by a competent team dedicated to ensuring safety and customer satisfaction.',

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
    'sidemenu.badge': 'Safe Solutions to Build Your Dream Space',
    'sidemenu.desc':
      'A professional company specializing in architectural design planning, interior contracting, construction contracting, and guaranteed waterproofing.',
    'sidemenu.contactInfo': 'Contact Information',
    'sidemenu.address': 'Address',
    'sidemenu.hotline': 'WhatsApp',
    'sidemenu.email': 'Email',
    'sidemenu.hours': 'Business Hours',
    'sidemenu.hoursVal': 'Monday - Saturday: 08:00 - 16:00 WIB',
    'sidemenu.hoursSun': 'Sunday / Public Holidays: Closed',
    'sidemenu.socialMedia': 'Social Media',
    'sidemenu.contactUs': 'Contact Us',
    'sidemenu.ctaWhatsapp': 'WHATSAPP CONSULTATION',

    // Footer
    'footer.about':
      'Official architectural planning studio, modern residential general contractor, and bespoke luxury interior design atelier based in Malang, East Java.',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Construction Services',
    'footer.rights': 'All Rights Reserved.',
    'footer.ctaTitle': 'Ready to Bring Your Dream Space to Life?',
    'footer.ctaDesc':
      'Discuss design concepts, site surveys, and cost estimations with zero initial commitment alongside our team.',
    'footer.ctaButton': 'WHATSAPP CONSULTATION',
    'footer.officeHoursTitle': 'Business Hours',
    'footer.officeHoursDays': 'Monday - Saturday: 08:00 - 16:00 WIB',
    'footer.officeHoursHolidays': 'Sunday & Holidays: Closed',
  },
} as const;

export type TranslationKey = keyof typeof ui[typeof defaultLang];
