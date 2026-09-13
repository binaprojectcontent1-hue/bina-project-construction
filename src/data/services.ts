/**
 * @file services.ts
 * @description Single Source of Truth for Bina Project services and capabilities.
 */

import type { ServiceItem } from '@types';

export const MASTER_SERVICES: readonly ServiceItem[] = [
  {
    id: 'konstruksi',
    title: 'Jasa Konstruksi Bangunan & Bangun Rumah Baru',
    shortTitle: 'Konstruksi Bangunan',
    description: 'Pembangunan hunian rumah tinggal, villa modern, dan gedung komersial berkualitas tinggi di Malang & Jawa Timur.',
    icon: 'solar:home-smile-linear',
    image: '/assets/img/service/service_1_1.jpg',
    href: '/portfolio',
    features: ['Struktur Beton Bertulang', 'Pengawasan Arsitek Berkala', 'Garansi Kebocoran & Struktur'],
  },
  {
    id: 'interior',
    title: 'Jasa Desain Interior & Custom Kitchen Set Minimalis',
    shortTitle: 'Desain Interior & Kitchen Set',
    description: 'Perancangan interior estetis, backdrop TV, wardrobe, dan pembuatan kitchen set HPL custom anti-rayap.',
    icon: 'solar:sofa-2-linear',
    image: '/assets/img/service/service_1_2.jpg',
    href: '/portfolio',
    features: ['Material HPL/Duco Premium', 'Engsel Slow-Motion & Rak Piring', 'Visualisasi 3D Realistis'],
  },
  {
    id: 'renovasi',
    title: 'Jasa Renovasi Rumah & Bangunan Komersial',
    shortTitle: 'Renovasi Bangunan',
    description: 'Perbaikan menyeluruh, penambahan lantai dak beton, peremajaan fasad, dan tata ulang ruang fungsional.',
    icon: 'solar:hammer-linear',
    image: '/assets/img/service/service_1_3.jpg',
    href: '/contact',
    features: ['Peningkatan Struktur Lantai 2', 'Peremajaan Fasad Modern', 'Manajemen Anggaran Efisien'],
  },
  {
    id: 'waterproofing',
    title: 'Aplikasi Waterproofing Dak Beton & Dinding Anti Bocor',
    shortTitle: 'Waterproofing Dak & Dinding',
    description: 'Solusi pelapisan anti bocor bergaransi untuk dak atap beton, kolam, dan dinding rembes.',
    icon: 'solar:shield-check-linear',
    image: '/assets/img/service/service_1_4.jpg',
    href: '/contact',
    features: ['Membran Bakar & Cair', 'Garansi Bebas Bocor Berjangka', 'Injeksi Keretakan Beton'],
  },
  {
    id: 'arsitektur-rab',
    title: 'Jasa Desain Arsitektur 3D & Pembuatan RAB Transparan',
    shortTitle: 'Desain 3D & Perhitungan RAB',
    description: 'Visualisasi 3D rendering realistis, gambar kerja DED, dan perhitungan anggaran pembangunan transparan.',
    icon: 'solar:pen-new-square-linear',
    image: '/assets/img/service/service_1_5.jpg',
    href: '/contact',
    features: ['Gambar Kerja Lengkap (DED)', 'RAB Spesifik Material', 'Konsultasi Tata Ruang Fengshui/Ergonomi'],
  },
  {
    id: 'developer',
    title: 'Pengembangan Properti & Real Estate',
    shortTitle: 'Developer Properti',
    description: 'Perencanaan kawasan perumahan klaster, studi kelayakan lahan, dan konstruksi unit hunian komersial.',
    icon: 'solar:buildings-linear',
    image: '/assets/img/service/service_1_6.jpg',
    href: '/contact',
    features: ['Site Plan Kawasan', 'Pematangan Lahan & Drainase', 'Pembangunan Unit Serentak'],
  },
] as const;

/**
 * Service options formatted for contact dropdown selection
 */
export const SERVICE_OPTIONS = MASTER_SERVICES.map((s) => s.shortTitle);
