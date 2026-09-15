/**
 * @file visionMission.ts
 * @description Single Source of Truth untuk Visi, 9 Misi Strategis, dan Nilai Inti K-P-I Bina Project.
 */

export interface MissionItem {
  readonly number: string;
  readonly keyword: string;
  readonly keywordEn: string;
  readonly text: string;
  readonly textEn: string;
  readonly icon: string;
}

export interface CoreValueItem {
  readonly letter: string;
  readonly title: string;
  readonly titleEn: string;
  readonly desc: string;
  readonly descEn: string;
  readonly icon: string;
}

export const VISION_DATA = {
  title: 'Visi Perusahaan',
  titleEn: 'Company Vision',
  badge: 'Arah & Komitmen Jangka Panjang',
  badgeEn: 'Our Strategic Direction & Commitment',
  text: 'Menjadi mitra konstruksi yang unggul dalam kompetensi, profesionalisme, dan integritas dengan memberikan layanan terpercaya bagi setiap klien serta berdampak pada kesejahteraan seluruh pemangku kepentingan.',
  textEn: 'To become a premier construction partner excelling in competence, professionalism, and integrity by delivering trusted services for every client and positively impacting the prosperity of all stakeholders.',
  tagline: 'Solusi Aman Membangun Ruang Impian',
  taglineEn: 'Safe Solution Building Your Dream Space',
} as const;

export const CORE_VALUES_DATA = {
  badge: 'Nilai Budaya Kerja',
  badgeEn: 'Work Culture Values',
  headline: 'Fondasi Utama: K-P-I',
  headlineEn: 'Our Core Pillar: K-P-I',
  quote: '“KPI kami bukan hanya angka, KPI kami adalah cara kami bekerja.”',
  quoteEn: '“Our KPI is not just numbers; our KPI is the standard of how we work.”',
  items: [
    {
      letter: 'K',
      title: 'Kompeten',
      titleEn: 'Competent',
      desc: 'Penguasaan teknis mendalam, tenaga ahli tersertifikasi, dan penerapan kaidah rekayasa konstruksi presisi di setiap detail ruang.',
      descEn: 'Advanced technical proficiency, certified specialists, and meticulous engineering standards applied to every spatial detail.',
      icon: 'solar:diploma-verified-bold',
    },
    {
      letter: 'P',
      title: 'Profesional',
      titleEn: 'Professional',
      desc: 'Disiplin jadwal yang ketat, kepatuhan SOP bertaraf nasional, komunikasi proaktif, dan dedikasi penuh pada kepuasan pemilik ruang.',
      descEn: 'Strict schedule adherence, national-standard SOP compliance, proactive communication, and unwavering client dedication.',
      icon: 'solar:shield-user-bold',
    },
    {
      letter: 'I',
      title: 'Integritas',
      titleEn: 'Integrity',
      desc: 'Transparansi anggaran tanpa biaya siluman, kejujuran spesifikasi material SNI, serta memegang teguh amanah kontrak kerja.',
      descEn: 'Total budget transparency with zero hidden costs, genuine SNI material specifications, and honoring contractual trust.',
      icon: 'solar:hand-heart-bold',
    },
  ] as const,
} as const;

export const MISSIONS_DATA: readonly MissionItem[] = [
  {
    number: '01',
    keyword: 'SDM Unggul',
    keywordEn: 'Superior Talent',
    text: 'Membangun tim yang kompeten melalui pelatihan berkelanjutan dan sertifikasi keahlian demi terwujudnya SDM Unggul.',
    textEn: 'Building a highly competent team through continuous specialized training and professional skill certifications.',
    icon: 'solar:users-group-rounded-bold',
  },
  {
    number: '02',
    keyword: 'Kepastian Jadwal',
    keywordEn: 'Timeline Certainty',
    text: 'Menjalankan setiap proyek dengan disiplin waktu dan prosedur yang tepat mulai dari perencanaan hingga serah terima sehingga klien mendapatkan kepastian jadwal.',
    textEn: 'Executing every project with precise schedule discipline and standardized procedures from planning to handover.',
    icon: 'solar:calendar-date-bold',
  },
  {
    number: '03',
    keyword: 'Digitalisasi Proyek',
    keywordEn: 'Digital Management',
    text: 'Memanfaatkan teknologi dan sistem manajemen proyek digital untuk memastikan setiap pekerjaan tergambar jelas sejak awal, terpantau selama proses, dan diselesaikan sesuai standar yang disepakati.',
    textEn: 'Leveraging digital project management systems to ensure crystal-clear plans, transparent real-time monitoring, and flawless delivery.',
    icon: 'solar:laptop-minimalistic-bold',
  },
  {
    number: '04',
    keyword: 'Etika & Amanah',
    keywordEn: 'Ethics & Trust',
    text: 'Menjalankan setiap layanan dengan mengedepankan etika dan prinsip amanah.',
    textEn: 'Conducting all operations with high professional ethics and safeguarding client trust with fiduciary responsibility.',
    icon: 'solar:shield-check-bold',
  },
  {
    number: '05',
    keyword: 'Komunikasi Terbuka',
    keywordEn: 'Transparent Communication',
    text: 'Membangun hubungan saling percaya dengan klien dan mitra melalui komunikasi yang terbuka.',
    textEn: 'Fostering long-term mutual trust with clients and partners through open, honest, and transparent communication.',
    icon: 'solar:chat-round-dots-bold',
  },
  {
    number: '06',
    keyword: 'Akuntabilitas Finansial',
    keywordEn: 'Financial Accountability',
    text: 'Mengelola anggaran setiap proyek secara akuntabel dan transparan.',
    textEn: 'Managing every construction budget with meticulous accountability, transparent cost structures, and itemized billing.',
    icon: 'solar:wallet-money-bold',
  },
  {
    number: '07',
    keyword: 'Standar Mutu SOP',
    keywordEn: 'SOP Quality Assurance',
    text: 'Menjamin kualitas setiap pekerjaan melalui Standar Operasional Prosedur (SOP) yang jelas dan terukur.',
    textEn: 'Guaranteeing consistent build quality through clear, measurable, and strictly audited Standard Operating Procedures.',
    icon: 'solar:checklist-minimalistic-bold',
  },
  {
    number: '08',
    keyword: 'Ekosistem Sejahtera',
    keywordEn: 'Worker Welfare',
    text: 'Membangun ekosistem kerja yang sejahtera melalui perlindungan kerja serta sistem penghargaan yang jelas dan terukur bagi seluruh tim yang terlibat.',
    textEn: 'Nurturing a prosperous work ecosystem through robust workplace safety and transparent merit-based reward systems.',
    icon: 'solar:heart-pulse-bold',
  },
  {
    number: '09',
    keyword: 'Kemitraan Berkelanjutan',
    keywordEn: 'Sustainable Partnership',
    text: 'Menumbuhkan kemitraan yang saling menguntungkan, transparan, dan berkelanjutan bagi seluruh pemangku kepentingan.',
    textEn: 'Cultivating mutually beneficial, transparent, and sustainable partnerships across all project stakeholders.',
    icon: 'solar:hand-shake-bold',
  },
] as const;
