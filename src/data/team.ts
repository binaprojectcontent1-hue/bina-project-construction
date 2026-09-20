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
    name: 'Gesang Sudrajad, S.ST., M.M.',
    jobTitle: 'Founder & Owner',
    role: 'Founder & Owner',
    description:
      'Berlatar belakang pendidikan Teknik Sipil, Gesang Sudrajad merintis Bina Project dengan tekad menghadirkan hunian dan ruang komersial yang tidak hanya kokoh secara struktur, tetapi juga estetis dan fungsional. Selama lebih dari 10 tahun, ia telah memimpin langsung berbagai proyek pembangunan hunian tapak (landed house), gedung bertingkat rendah (low rise building), area komersial, hingga pengerjaan interior tingkat tinggi — memastikan setiap detail, dari pondasi hingga sentuhan akhir, dikerjakan sesuai standar yang ia pegang teguh sejak hari pertama Bina Project berdiri.',
    expertise: [
      'Visi Strategis & Business Development',
      'Manajemen Mutu Konstruksi Terpadu',
      'Kemitraan Strategis & Hubungan Klien',
      'Pengawasan Standar Pelaksanaan Proyek',
      'Tata Kelola & Kepatuhan Legalitas Bangunan',
    ],
    image: '/assets/img/team/gesang-sudrajad.webp',
    email: 'binaproject.info@gmail.com',
  },
  {
    id: 'marhaendra-muslim',
    name: 'Ir. Marhaendra Muslim Bachtiyar, S.T.',
    jobTitle: 'Project Management Specialist',
    role: 'Project Management Specialist',
    description:
      'Mengantongi Sertifikasi Profesi Insinyur dan berlatar belakang Teknik Sipil, Ir. Marhaendra Muslim Bachtiyar telah berkecimpung di dunia konstruksi sejak tahun 2008. Rekam jejaknya membentang dari pembangunan rumah tinggal dan gedung bertingkat, hingga proyek infrastruktur jalan dan jembatan serta bangunan keairan. Keahlian teknis dan pengalaman lintas sektor inilah yang menjadi jaminan bahwa setiap rancangan dan metode kerja di Bina Project telah melalui kajian rekayasa yang matang dan sesuai standar keselamatan yang berlaku.',
    expertise: [
      'Sertifikasi Profesi Insinyur & Rekayasa Struktur',
      'Manajemen Konstruksi & Proyek Infrastruktur',
      'Standarisasi K3 & Keselamatan Kerja Bangunan',
      'Rekayasa Nilai & Pengawasan Mutu Proyek',
      'Kajian Teknis Bangunan Sipil & Keairan',
    ],
    image: '/assets/img/team/marhaendra-muslim.webp',
    email: 'binaproject.info@gmail.com',
  },
  {
    id: 'kuncoro-widiyan',
    name: 'Kuncoro Widiyan Nugroho, S.Ak.',
    jobTitle: 'Financial Specialist',
    role: 'Financial Specialist',
    description:
      'Kuncoro Widiyan Nugroho menempuh pendidikan Akuntansi dan mengasah jam terbangnya sebagai akuntan di beberapa dinas pemerintahan serta perusahaan sebelum bergabung dengan Bina Project. Pengalaman lintas sektor ini membentuk ketelitiannya dalam mengelola keuangan proyek — mulai dari penyusunan anggaran, pengawasan arus kas, hingga memastikan efisiensi RAB agar investasi klien berjalan sesuai rencana tanpa kejutan biaya di kemudian hari.',
    expertise: [
      'Financial Planning & Cost Analysis',
      'Pengendalian & Efisiensi Anggaran Proyek (RAB)',
      'Audit Finansial & Akuntansi Konstruksi',
      'Manajemen Arus Kas & Pengadaan Finansial',
      'Transparansi Pelaporan Keuangan Klien',
    ],
    image: '/assets/img/team/kuncoro-widiyan.webp',
    email: 'binaproject.info@gmail.com',
  },
  {
    id: 'firdhan-choirul',
    name: 'Firdhan Choirul Anwar, S.Ikom.',
    jobTitle: 'Digital Marketing Specialist',
    role: 'Digital Marketing Specialist',
    description:
      'Kecintaan pada dunia seni dan digital yang tumbuh sejak kecil membawa Firdhan Choirul Anwar, lulusan Ilmu Komunikasi, menekuni digital marketing secara serius. Lebih dari 5 tahun ia malang melintang di industri ini, mengasah kepekaan terhadap tren dan perilaku audiens digital. Di Bina Project, ia menerjemahkan pengalaman tersebut menjadi strategi pemasaran yang menghubungkan kualitas kerja perusahaan dengan calon klien yang tepat.',
    expertise: [
      'Digital Marketing & Strategic Branding',
      'Komunikasi Publik & Manajemen Relasi Klien',
      'Riset Tren & Perilaku Audiens Digital',
      'Pengembangan Kemitraan & Market Expansion',
      'Client Journey & Experience Enhancement',
    ],
    image: '/assets/img/team/firdhan-choirul.webp',
    email: 'binaproject.info@gmail.com',
  },
] as const;
