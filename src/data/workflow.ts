/**
 * @file workflow.ts
 * @description Single Source of Truth for Bina Project 4-stage construction and interior workflow.
 */

import type { WorkflowStep } from '@types';

export const WORKFLOW_STEPS: readonly WorkflowStep[] = [
  {
    number: '01',
    title: 'Survei & Analisis Lokasi',
    desc: 'Sebelum masuk ke tahap desain, kami memastikan kondisi lahan dipahami dengan baik. Tim melakukan pengukuran, melihat kondisi kontur dan tanah, serta mengecek akses menuju lokasi untuk kebutuhan pembangunan.',
    deliverable: 'Data pengukuran tapak dan kajian awal kelayakan teknis lahan.',
    phaseTag: 'Tahap Awal & Investigasi',
    badgeText: 'Akurasi Tapak 99.8%',
    image: '/assets/img/normal/process_stage1_survey.jpg',
    milestones: [
      'Mengukur batas dan elevasi lahan menggunakan laser meter',
      'Meninjau kondisi tanah dan kebutuhan fondasi',
      'Mengecek akses kendaraan, material, serta utilitas di sekitar lokasi'
    ]
  },
  {
    number: '02',
    title: 'Perancangan & RAB',
    desc: 'Setelah kondisi lahan diketahui, proses dilanjutkan ke tahap perancangan. Gambar kerja, visualisasi 3D, dokumen teknis, dan perhitungan biaya disusun secara terintegrasi agar Anda memiliki gambaran yang jelas sebelum pembangunan dimulai.',
    deliverable: 'Buku gambar kerja DED dan rincian RAB sebagai dasar pelaksanaan proyek.',
    phaseTag: 'Tahap Desain & Anggaran',
    badgeText: 'DED Presisi & Mengikat',
    image: '/assets/img/normal/process_stage2_design.jpg',
    milestones: [
      'Menyusun gambar kerja DED untuk arsitektur, struktur, dan MEP',
      'Membuat visualisasi 3D exterior dan interior',
      'Menghitung RAB berdasarkan volume pekerjaan dan kebutuhan material'
    ]
  },
  {
    number: '03',
    title: 'Konstruksi & Pengawasan',
    desc: 'Memasuki tahap pembangunan, pekerjaan dikerjakan oleh tenaga spesialis sesuai bidangnya dan dipantau secara berkala. Kami menjaga agar pelaksanaan di lapangan tetap mengacu pada gambar kerja, spesifikasi material, dan kesepakatan yang telah dibuat.',
    deliverable: 'Bangunan yang dikerjakan sesuai spesifikasi serta laporan perkembangan proyek secara berkala.',
    phaseTag: 'Tahap Realisasi Fisik',
    badgeText: 'Quality Control Terstandar',
    image: '/assets/img/normal/process_stage3_construction.jpg',
    milestones: [
      'Pengerjaan konstruksi oleh tenaga berpengalaman',
      'Pemeriksaan material dan pekerjaan struktur secara berkala',
      'Supervisi lapangan oleh Lead Architect dan tim proyek',
      'Memberikan laporan progres foto dan video setiap minggu melalui WhatsApp'
    ]
  },
  {
    number: '04',
    title: 'Serah Terima & Garansi',
    desc: 'Sebelum proyek dinyatakan selesai, kami melakukan pemeriksaan bersama untuk memastikan fungsi dan kualitas bangunan sesuai dengan pekerjaan yang telah disepakati. Setelah semuanya selesai, bangunan diserahterimakan secara resmi beserta dokumen pendukung dan garansi pemeliharaan.',
    deliverable: 'Kunci bangunan, dokumen BAST, dan Sertifikat Garansi Pemeliharaan.',
    phaseTag: 'Tahap Final & Jaminan Mutu',
    badgeText: 'Garansi Resmi Pemeliharaan',
    image: '/assets/img/normal/process_stage4_handover.jpg',
    milestones: [
      'Joint inspection untuk memeriksa sanitasi, listrik, dan finishing',
      'Penandatanganan Berita Acara Serah Terima (BAST)',
      'Serah terima kunci bangunan',
      'Penerbitan Sertifikat Garansi Pemeliharaan Bina Project'
    ]
  },
] as const;
