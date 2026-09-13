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
    name: 'Gesang Sudrajad',
    jobTitle: 'Direktur & Founder',
    role: 'Direktur Utama',
    description:
      'Memimpin Bina Project Construction sejak 2014 dengan visi layanan konstruksi dan interior yang transparan, berkualitas, dan terjangkau untuk masyarakat Malang dan Jawa Timur. Bertanggung jawab atas strategi bisnis, kemitraan, dan quality assurance proyek.',
    expertise: [
      'Business Development & Strategi Konstruksi',
      'Project Management & Quality Control',
      'Client Relations & Stakeholder Management',
      'Cost Estimation & Budget Planning',
      'Construction Legal & Compliance',
    ],
    image: '/assets/img/team/gesang-sudrajad.svg',
    email: 'binaproject.info@gmail.com',
  },
  {
    id: 'adji-kurniawan',
    name: 'Adji Kurniawan',
    jobTitle: 'Lead Architect',
    role: 'Kepala Arsitek',
    description:
      'Arsitek profesional yang bertanggung jawab atas seluruh desain arsitektur, pengawasan konstruksi lapangan, dan quality control. Spesialisasi arsitektur tropis modern dan desain struktural untuk hunian residensial dan komersial.',
    expertise: [
      'Arsitektur Tropis Modern & Minimalis',
      'Structural Design & Engineering',
      'Detail Engineering Design (DED)',
      '3D Visualization (SketchUp, AutoCAD)',
      'Site Supervision & Construction Management',
    ],
    image: '/assets/img/team/adji-kurniawan.svg',
    email: 'binaproject.info@gmail.com',
  },
  {
    id: 'faisal-anam',
    name: 'Faisal Anam',
    jobTitle: 'Logistics & Procurement Manager',
    role: 'Manajer Logistik',
    description:
      'Mengelola procurement material konstruksi, koordinasi supplier, dan logistik pengiriman ke site proyek. Memastikan material berkualitas tiba tepat waktu sesuai jadwal konstruksi.',
    expertise: [
      'Material Procurement & Vendor Management',
      'Supply Chain Optimization',
      'Quality Inspection & Material Testing',
      'Inventory Management',
      'Cost Negotiation & Budget Control',
    ],
    image: '/assets/img/team/faisal-anam.svg',
    email: 'binaproject.info@gmail.com',
  },
  {
    id: 'udin',
    name: 'Udin',
    jobTitle: 'Senior Drafter',
    role: 'Drafter Teknis',
    description:
      'Drafter berpengalaman yang menerjemahkan konsep desain arsitek menjadi gambar kerja teknis presisi (DED) untuk pelaksanaan konstruksi. Ahli AutoCAD dan detail engineering drawing.',
    expertise: [
      'AutoCAD 2D & 3D Drafting',
      'Detail Engineering Drawing (DED)',
      'Shop Drawing & As-Built Documentation',
      'Technical Specification Writing',
      'Construction Document Management',
    ],
    image: '/assets/img/team/udin.svg',
    email: 'binaproject.info@gmail.com',
  },
  {
    id: 'nanda',
    name: 'Nanda',
    jobTitle: 'Social Media & Marketing Specialist',
    role: 'Spesialis Media Sosial',
    description:
      'Mengelola strategi digital marketing, konten media sosial (Instagram, TikTok, YouTube), dan komunikasi online dengan klien potensial. Bertanggung jawab atas brand awareness dan lead generation Bina Project.',
    expertise: [
      'Social Media Management (Instagram, TikTok, YouTube)',
      'Content Creation & Photography',
      'Digital Marketing Strategy',
      'Client Communication & Lead Generation',
      'Brand Storytelling & Visual Design',
    ],
    image: '/assets/img/team/nanda.svg',
    email: 'binaproject.info@gmail.com',
  },
] as const;
