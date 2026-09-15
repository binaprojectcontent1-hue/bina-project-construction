/**
 * @file team.ts
 * @description Single Source of Truth untuk tim profesional Bina Project (GEO: Person schema).
 */

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly jobTitle: string;
  readonly role: string;
  readonly description: string;
  readonly expertise: readonly string[];
  readonly image: string;
  readonly email?: string;
  readonly linkedIn?: string;
}

export const TEAM_MEMBERS: readonly TeamMember[] = [
  {
    id: 'gesang-sudrajad',
    name: 'H. Gesang Sudrajad, S.ST., M.M',
    jobTitle: 'Founder & Owner',
    role: 'Founder & Owner',
    description:
      'Spesialis konstruksi residensial, komersial dan interior dengan pengalaman lebih dari 10 tahun dalam memimpin proyek pembangunan hunian tapak (landed house), gedung bertingkat rendah (low risk building), area komersial, hingga pengerjaan interior tingkat tinggi. Fokus pada kombinasi kekuatan struktural, estetika visual, keakuratan detail dan fungsionalitas ruang.',
    expertise: [
      'Visi Strategis & Business Development',
      'Manajemen Mutu Konstruksi Terpadu',
      'Kemitraan Strategis & Hubungan Klien',
      'Pengawasan Standar Pelaksanaan Proyek',
      'Tata Kelola & Kepatuhan Legalitas Bangunan',
    ],
    image: '/assets/img/team/gesang-sudrajad.svg',
    email: 'binaproject.info@gmail.com',
  },
  {
    id: 'sahnawi',
    name: 'Sahnawi, S.ST., M.MT',
    jobTitle: 'Technical Advisor',
    role: 'Technical Advisor',
    description:
      'Penasihat teknis senior yang memastikan setiap tahapan rancang bangun memenuhi kalkulasi rekayasa struktur, standar keselamatan bangunan (SNI), dan efektivitas metode kerja di lapangan.',
    expertise: [
      'Analisis Rekayasa Struktural & Geoteknik',
      'Advisory Teknis Pelaksanaan Lapangan',
      'Standarisasi Mutu & Keselamatan Kerja (SNI)',
      'Mitigasi Risiko Teknis & Rekayasa Nilai',
      'Audit Kelaikan Konstruksi Bangunan',
    ],
    image: '/assets/img/team/sahnawi.svg',
    email: 'binaproject.info@gmail.com',
  },
  {
    id: 'kuncoro-widiyan',
    name: 'Kuncoro Widiyan Nugroho, S.Ak',
    jobTitle: 'Manager Financial',
    role: 'Manager Financial',
    description:
      'Mengelola akurasi perencanaan anggaran, audit biaya riil, transparansi arus kas proyek, serta kepastian efisiensi RAB agar investasi pembangunan berjalan terukur tanpa beban biaya tak terduga.',
    expertise: [
      'Financial Planning & Cost Analysis',
      'Pengendalian & Efisiensi Anggaran Proyek (RAB)',
      'Audit Finansial & Akuntansi Konstruksi',
      'Manajemen Arus Kas & Pengadaan Finansial',
      'Transparansi Pelaporan Keuangan Klien',
    ],
    image: '/assets/img/team/kuncoro-widiyan.svg',
    email: 'binaproject.info@gmail.com',
  },
  {
    id: 'firdhan-choirul',
    name: 'Firdhan Choirul Anwar, S.Ikom',
    jobTitle: 'Manager Marketing',
    role: 'Manager Marketing',
    description:
      'Mengorkestrasi strategi pemasaran, komunikasi merek, relasi klien, dan konsultasi kebutuhan awal guna memastikan calon klien memperoleh solusi terbaik dan pengalaman pelayanan yang prima.',
    expertise: [
      'Digital Marketing & Strategic Branding',
      'Komunikasi Publik & Manajemen Relasi Klien',
      'Fasilitasi Konsultasi Kebutuhan Awal Ruang',
      'Pengembangan Kemitraan & Market Expansion',
      'Client Journey & Experience Enhancement',
    ],
    image: '/assets/img/team/firdhan-choirul.svg',
    email: 'binaproject.info@gmail.com',
  },
] as const;
