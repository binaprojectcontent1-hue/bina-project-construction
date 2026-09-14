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

    // About Page
    'about.title': 'Tentang Bina Project Studio',
    'about.subtitle':
      'Perjalanan, dedikasi, dan standar profesionalisme dalam setiap karya arsitektur dan konstruksi fisik.',
    'about.missionBadge': 'VISI & MISI KAMI',
    'about.missionTitle': 'Membangun Masa Depan dengan Mutu Tertinggi',
    'about.teamTitle': 'Tim Arsitek & Manajemen Proyek',
    'about.teamSubtitle': 'Tenaga ahli bersertifikasi yang berdedikasi mewujudkan standar bangunan presisi.',

    // Portfolio Page
    'portfolio.title': 'Katalog Karya Arsitektur & Interior',
    'portfolio.subtitle':
      'Kumpulan portofolio proyek konstruksi rumah tinggal, renovasi komersial, villa, dan interior kustom.',
    'portfolio.filterAll': 'Semua',
    'portfolio.filterConstruction': 'Konstruksi',
    'portfolio.filterInterior': 'Interior & Furniture',
    'portfolio.filterRenovation': 'Renovasi',
    'portfolio.viewDetail': 'Lihat Detail Proyek',

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

    // Footer
    'footer.about':
      'Studio perencanaan arsitektur, kontraktor bangunan rumah modern, dan interior estetik profesional berpusat di Malang, Jawa Timur.',
    'footer.quickLinks': 'Navigasi Cepat',
    'footer.services': 'Layanan Konstruksi',
    'footer.rights': 'Seluruh Hak Cipta Dilindungi.',
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

    // About Page
    'about.title': 'About Bina Project Studio',
    'about.subtitle':
      'Our journey, architectural craftsmanship, and unrelenting dedication to structural excellence.',
    'about.missionBadge': 'OUR VISION & MISSION',
    'about.missionTitle': 'Building the Future with the Highest Quality Standards',
    'about.teamTitle': 'Architectural Team & Project Management',
    'about.teamSubtitle': 'Certified professionals committed to engineering precision and architectural elegance.',

    // Portfolio Page
    'portfolio.title': 'Architecture & Interior Catalog',
    'portfolio.subtitle':
      'Curated showcase of residential buildings, commercial spaces, contemporary villas, and bespoke interiors.',
    'portfolio.filterAll': 'All',
    'portfolio.filterConstruction': 'Construction',
    'portfolio.filterInterior': 'Interior & Furniture',
    'portfolio.filterRenovation': 'Renovation',
    'portfolio.viewDetail': 'View Project Details',

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

    // Footer
    'footer.about':
      'Official architectural planning studio, modern residential general contractor, and bespoke luxury interior design atelier based in Malang, East Java.',
    'footer.quickLinks': 'Quick Navigation',
    'footer.services': 'Construction Services',
    'footer.rights': 'All Rights Reserved.',
  },
} as const;

export type TranslationKey = keyof typeof ui[typeof defaultLang];
