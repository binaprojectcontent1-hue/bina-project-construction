/**
 * @file coverage.ts
 * @description Single Source of Truth for operational coverage, base location, and service corridors.
 */

import type { ServiceLocation } from '@types';

export const SERVICE_LOCATIONS: readonly ServiceLocation[] = [
  {
    id: 'malang',
    name: 'Malang Raya (Kota & Kab. Malang, Kota Batu)',
    city: 'Kota Malang',
    shortName: 'Malang (Base Utama)',
    role: 'Satu-Satunya Base Kantor & Workshop',
    status: 'Kantor Pusat & Studio Workshop (Single Base)',
    isHQ: true,
    isBase: true,
    address: 'Jl. Watumujur II No.6, Ketawanggede, Lowokwaru, Kota Malang',
    coordinates: [112.6088, -7.9498],
    latLng: [-7.9498, 112.6088],
    coverage: ['Kota Malang', 'Kota Batu', 'Kabupaten Malang'],
    services: 'Studio Arsitektur, Fabrikasi Kitchen Set/Interior, & Konstruksi Bangunan Baru / Renovasi',
    highlight: 'Satu-satunya base kantor fisik & workshop. Survei tapak 100% GRATIS & bebas konsultasi langsung.',
    badge: 'BASE UTAMA & WORKSHOP',
    description: 'Pusat studio arsitektur terpadu, tim perencana 3D visual, dan workshop fabrikasi interior resmi Bina Project.',
    details: 'Survei tapak gratis tanpa ikatan, konsultasi tatap muka, dan kunjungan langsung ke workshop fabrikasi.',
    labelOffsetX: -175,
    labelOffsetY: -22,
    image: '/assets/img/project/2.jpg',
    travelTime: '0 Menit (Base Operasional)',
    tollRoute: 'Pusat Operasional Kota Malang (Akses Langsung)',
    projectCount: '95+ Proyek Terealisasi',
    districts: [
      'Klojen',
      'Lowokwaru',
      'Blimbing',
      'Sukun',
      'Kedungkandang',
      'Kota Batu',
      'Bumiaji',
      'Junrejo',
      'Singosari',
      'Lawang',
      'Karangploso',
      'Dau',
      'Pakis',
      'Kepanjen',
    ],
    sampleProjects: [
      {
        title: 'Villa Modern Batu',
        category: 'Konstruksi Villa Tropis',
        slug: 'villa',
        img: '/assets/img/project/2.jpg',
      },
      {
        title: 'SDI Nur Multazam',
        category: 'Gedung Sarana Pendidikan',
        slug: 'sdi-nur-multazam',
        img: '/assets/img/project/1.jpg',
      },
      {
        title: 'Cafe Batu Estetik',
        category: 'Desain Interior Komersial',
        slug: 'cafe-batu',
        img: '/assets/img/project/3.jpg',
      },
      {
        title: 'Kitchen Set Dr. Irfan',
        category: 'Custom Interior Minimalis',
        slug: 'kitchen-set-dr-irfan',
        img: '/assets/img/project/6.jpg',
      },
    ],
  },
  {
    id: 'pasuruan',
    name: 'Koridor Pasuruan & Pandaan',
    city: 'Pasuruan & Sekitarnya',
    shortName: 'Pasuruan & Pandaan',
    role: 'Area Jangkauan Proyek Prioritas',
    status: 'Area Jangkauan Pengerjaan Proyek',
    isHQ: false,
    isBase: false,
    address: 'Penugasan Tim & Armada Mandiri dari Base Malang (± 45 Menit)',
    coordinates: [112.6955, -7.6534], // Pandaan - Pasuruan central hub
    latLng: [-7.6534, 112.6955],
    coverage: ['Kota Pasuruan', 'Pandaan', 'Prigen', 'Bangil', 'Purwosari', 'Sukorejo'],
    services: 'Konstruksi Villa Pegunungan, Renovasi Rumah Tinggal, & Fabrikasi Kitchen Set Custom',
    highlight: 'Survei lokasi terjadwal cepat, pengawasan mandor harian, dan jaminan SPK bergaransi resmi.',
    badge: 'AREA LAYANAN PRIORITAS',
    description: 'Koridor strategis Pandaan, Prigen, Bangil, dan Pasuruan. Spesialisasi konstruksi villa sejuk, perumahan, dan interior.',
    details: 'Mobilisasi armada material dan tukang ahli langsung dari Base Malang (< 45 Menit).',
    labelOffsetX: 16,
    labelOffsetY: -20,
    image: '/assets/img/project/4.jpg',
    travelTime: '± 35 - 45 Menit',
    tollRoute: 'Pandaan - Malang (Purwodadi / Pandaan)',
    projectCount: '38+ Proyek Terealisasi',
    districts: [
      'Pandaan',
      'Prigen',
      'Bangil',
      'Purwosari',
      'Sukorejo',
      'Gempol',
      'Beji',
      'Kota Pasuruan',
      'Kraton',
    ],
    sampleProjects: [
      {
        title: 'Rosana Residence',
        category: 'Fasad & Hunian Residensial',
        slug: 'rosana',
        img: '/assets/img/project/4.jpg',
      },
      {
        title: 'Rosana Collection Store',
        category: 'Interior Butik & Toko Ritel',
        slug: 'rosana-collection',
        img: '/assets/img/project/5.jpg',
      },
      {
        title: 'Kitchen Set Pasuruan',
        category: 'Interior Dapur & Ruang Makan',
        slug: 'kitchen-set',
        img: '/assets/img/project/7.jpg',
      },
    ],
  },
  {
    id: 'surabaya',
    name: 'Surabaya Metropolitan & Sidoarjo',
    city: 'Surabaya & Sidoarjo',
    shortName: 'Surabaya & Sidoarjo',
    role: 'Area Jangkauan Proyek Prioritas',
    status: 'Area Jangkauan Pengerjaan Proyek',
    isHQ: false,
    isBase: false,
    address: 'Penugasan Tim Arsitek & Logistik Terpadu dari Base Malang (± 75 Menit)',
    coordinates: [112.7521, -7.2575],
    latLng: [-7.2575, 112.7521],
    coverage: ['Surabaya Barat', 'Surabaya Timur', 'Surabaya Pusat & Selatan', 'Sidoarjo & Waru'],
    services: 'Renovasi Ruko/Kantor Komersial, Interior Apartemen Mewah, & Pembangunan Rumah Tinggal Modern',
    highlight: 'Konsultasi virtual responsif, survei tapak terjadwal, prefabrikasi rapi di workshop sebelum pemasangan.',
    badge: 'AREA LAYANAN PRIORITAS',
    description: 'Kawasan metropolitan Surabaya & Sidoarjo. Melayani renovasi ruko komersial, kantor, interior apartemen, & hunian residensial.',
    details: 'Penugasan tim spesialis dan armada material mandiri dari Base Malang (< 75 Menit).',
    labelOffsetX: 16,
    labelOffsetY: -20,
    image: '/assets/img/project/8.jpg',
    travelTime: '± 60 - 75 Menit',
    tollRoute: 'Surabaya - Porong - Gempol - Pandaan - Malang',
    projectCount: '45+ Proyek Terealisasi',
    districts: [
      'Surabaya Barat (Citraland, Pakuwon Indah)',
      'Surabaya Timur (Rungkut, MERR, Sukolilo)',
      'Surabaya Pusat (Tegalsari, Genteng, Gubeng)',
      'Surabaya Selatan (Wonokromo, Gayungan, Jambangan)',
      'Sidoarjo Kota',
      'Waru & Aloha',
      'Gedangan',
      'Sedati & Juanda',
    ],
    sampleProjects: [
      {
        title: 'Interior Modern Mr. Samian',
        category: 'Transformasi Interior Japandi',
        slug: 'interior-mr-samian',
        img: '/assets/img/project/8.jpg',
      },
      {
        title: 'AMD Academy Training Center',
        category: 'Fit-out & Renovasi Komersial',
        slug: 'amd-academy',
        img: '/assets/img/project/9.jpg',
      },
    ],
  },
] as const;

/**
 * Data untuk Coverage Checker Widget
 */
export interface CoverageDistrictCheck {
  readonly district: string;
  readonly regionId: 'malang' | 'pasuruan' | 'surabaya';
  readonly regionName: string;
  readonly status: 'prioritas' | 'didukung';
  readonly surveyFee: 'GRATIS 100%' | 'Survei Terjadwal Gratis';
  readonly travelEstimate: string;
  readonly note: string;
}

export const DISTRICT_LOOKUP: readonly CoverageDistrictCheck[] = [
  // Malang Raya
  { district: 'Kota Malang - Lowokwaru (Sekitar Kantor)', regionId: 'malang', regionName: 'Malang Raya (Base Utama)', status: 'prioritas', surveyFee: 'GRATIS 100%', travelEstimate: '10 - 15 Menit', note: 'Base workshop & studio arsitek kami berlokasi di Lowokwaru. Survei dapat dilakukan di hari yang sama.' },
  { district: 'Kota Malang - Klojen / Blimbing / Sukun / Kedungkandang', regionId: 'malang', regionName: 'Malang Raya (Base Utama)', status: 'prioritas', surveyFee: 'GRATIS 100%', travelEstimate: '15 - 25 Menit', note: 'Survei tapak langsung & gratis. Jadwal fleksibel pagi hingga sore.' },
  { district: 'Kota Batu - Oro-oro Ombo / Sisir / Bumiaji / Junrejo', regionId: 'malang', regionName: 'Malang Raya (Base Utama)', status: 'prioritas', surveyFee: 'GRATIS 100%', travelEstimate: '25 - 35 Menit', note: 'Sangat sering menangani villa peristirahatan dan cafe komersial di Kota Batu.' },
  { district: 'Kabupaten Malang - Singosari / Lawang / Karangploso / Dau', regionId: 'malang', regionName: 'Malang Raya (Base Utama)', status: 'prioritas', surveyFee: 'GRATIS 100%', travelEstimate: '20 - 30 Menit', note: 'Dekat akses gerbang tol Singosari/Lawang. Survei gratis.' },
  { district: 'Kabupaten Malang - Pakis / Tumpang / Kepanjen', regionId: 'malang', regionName: 'Malang Raya (Base Utama)', status: 'prioritas', surveyFee: 'GRATIS 100%', travelEstimate: '30 - 45 Menit', note: 'Tercakup penuh untuk pembangunan hunian baru dan renovasi skala menengah-besar.' },

  // Pasuruan Corridor
  { district: 'Pasuruan - Pandaan & Taman Dayu', regionId: 'pasuruan', regionName: 'Koridor Pasuruan & Pandaan', status: 'prioritas', surveyFee: 'Survei Terjadwal Gratis', travelEstimate: '± 35 Menit', note: 'Akses cepat dari Malang ke Pandaan. Sangat ideal untuk proyek villa & hunian.' },
  { district: 'Pasuruan - Prigen & Tretes', regionId: 'pasuruan', regionName: 'Koridor Pasuruan & Pandaan', status: 'prioritas', surveyFee: 'Survei Terjadwal Gratis', travelEstimate: '± 45 Menit', note: 'Spesialisasi villa pegunungan dengan kontur tanah berkontur dan iklim sejuk.' },
  { district: 'Pasuruan - Bangil / Purwosari / Sukorejo', regionId: 'pasuruan', regionName: 'Koridor Pasuruan & Pandaan', status: 'didukung', surveyFee: 'Survei Terjadwal Gratis', travelEstimate: '± 40 - 50 Menit', note: 'Dekat jalur utama Malang-Surabaya. Mobilisasi armada mandiri.' },
  { district: 'Kota Pasuruan - Panggungrejo / Purworejo / Gadingrejo', regionId: 'pasuruan', regionName: 'Koridor Pasuruan & Pandaan', status: 'didukung', surveyFee: 'Survei Terjadwal Gratis', travelEstimate: '± 50 - 60 Menit', note: 'Bina Project telah menyelesaikan beberapa proyek residensial & toko komersial di Pasuruan.' },

  // Surabaya & Sidoarjo
  { district: 'Surabaya Barat - Citraland / Pakuwon Indah / Sambikerep / Wiyung', regionId: 'surabaya', regionName: 'Surabaya Metropolitan', status: 'prioritas', surveyFee: 'Survei Terjadwal Gratis', travelEstimate: '± 70 Menit', note: 'Pelayanan renovasi rumah cluster mewah, fit-out interior, dan custom kitchen set modern.' },
  { district: 'Surabaya Timur - Rungkut / MERR / Sukolilo / Tenggilis', regionId: 'surabaya', regionName: 'Surabaya Metropolitan', status: 'prioritas', surveyFee: 'Survei Terjadwal Gratis', travelEstimate: '± 65 Menit', note: 'Tim survei terjadwal setiap minggu.' },
  { district: 'Surabaya Pusat & Selatan - Tegalsari / Gubeng / Wonokromo / Gayungan', regionId: 'surabaya', regionName: 'Surabaya Metropolitan', status: 'prioritas', surveyFee: 'Survei Terjadwal Gratis', travelEstimate: '± 60 - 75 Menit', note: 'Interior apartemen, kantor representatif, ruko, dan hunian bertingkat.' },
  { district: 'Sidoarjo - Waru / Aloha / Sedati / Juanda / Gedangan', regionId: 'surabaya', regionName: 'Sidoarjo & Waru', status: 'prioritas', surveyFee: 'Survei Terjadwal Gratis', travelEstimate: '± 55 - 65 Menit', note: 'Mobilisasi armada sangat cepat dari arah Malang.' },
  { district: 'Sidoarjo - Sidoarjo Kota / Buduran / Candi / Sukodono', regionId: 'surabaya', regionName: 'Sidoarjo & Waru', status: 'didukung', surveyFee: 'Survei Terjadwal Gratis', travelEstimate: '± 60 Menit', note: 'Layanan konstruksi rumah baru, penambahan lantai, dan interior rumah modern.' },
] as const;

/**
 * Alur Logistik Kerja Lintas Wilayah
 */
export const LOGISTICS_WORKFLOW = [
  {
    step: '01',
    title: 'Survei Tapak Presisi & Laser Measurement',
    desc: 'Tim arsitek & perencana kami datang langsung ke tapak Anda dengan peralatan digital (drone & laser measurement) untuk menganalisis kontur tanah, batas lahan, dan struktur.',
    benefit: 'Akurasi ukuran 100% tanpa risiko salah pasang',
    icon: 'solar:ruler-cross-pen-bold',
  },
  {
    step: '02',
    title: 'Desain 3D Realistis & RAB Terbuka',
    desc: 'Proses konsultasi intensif secara online via Zoom / video call atau offline di Studio Malang. Kami buatkan desain 3D photorealistic beserta Rancangan Anggaran Biaya (RAB) transparan per item material.',
    benefit: 'Transparan, tanpa biaya siluman di tengah proyek',
    icon: 'solar:layers-minimalistic-bold',
  },
  {
    step: '03',
    title: 'Prefabrikasi di Workshop Mandiri Malang',
    desc: 'Seluruh pesanan interior, rangka kitchen set, partisi, dan modul kayu dikerjakan di workshop fisik kami di Malang oleh tukang kayu berpengalaman dengan standar laminasi presisi.',
    benefit: 'Lokasi proyek Anda tetap bersih, minim bising & debu',
    icon: 'solar:buildings-bold',
  },
  {
    step: '04',
    title: 'Mobilisasi Armada & Instalasi SPK Garansi',
    desc: 'Armada logistik mandiri kami bergerak langsung menuju tapak proyek di Malang, Pasuruan, atau Surabaya. Pengerjaan dipandu mandor berpengalaman dan dilindungi SPK bergaransi resmi.',
    benefit: 'Jaminan pemeliharaan & proteksi garansi tertulis',
    icon: 'solar:shield-check-bold',
  },
] as const;

/**
 * FAQ Wilayah Layanan
 */
export const COVERAGE_FAQS = [
  {
    question: 'Apakah survei tapak ke luar kota Malang dikenakan biaya?',
    answer: 'Untuk wilayah Kota Malang, Kota Batu, dan Kabupaten Malang dekat kota, survei tapak dan konsultasi awal 100% GRATIS tanpa ikatan apapun. Untuk wilayah Koridor Pasuruan dan Surabaya-Sidoarjo, survei terjadwal juga disediakan gratis saat ada jadwal kunjungan tim ke koridor tersebut atau disubsidi sebagai bagian dari kesepakatan SPK proyek Anda.',
  },
  {
    question: 'Bagaimana Bina Project mengawasi proyek di Pasuruan atau Surabaya dari Malang?',
    answer: 'Kami menerapkan sistem manajemen proyek ganda: Mandor teknis berdedikasi tetap standby di lokasi proyek setiap hari kerja, dan Site Engineer/Arsitek kepala dari Malang melakukan inspeksi berkala terencana. Anda juga mendapatkan laporan progres foto & video mingguan secara transparan.',
  },
  {
    question: 'Mengapa interior difabrikasi di workshop Malang bukan langsung di lokasi proyek?',
    answer: 'Dengan memproduksi kabinet, kitchen set, dan partisi di workshop berstandar kami di Malang, proses pengerjaan menggunakan mesin potong presisi dan pengepresan HPL bersuhu terkontrol. Hal ini menghasilkan kualitas jauh lebih rapi, awet, dan membuat rumah/lokasi proyek Anda terbebas dari kebisingan serta tumpukan serbuk gergaji selama berminggu-minggu.',
  },
  {
    question: 'Berapa lama estimasi armada material sampai ke lokasi proyek di luar Malang?',
    answer: 'Armada mandiri Bina Project mampu menjangkau titik proyek di Pasuruan dalam waktu ±35-45 menit dan wilayah Surabaya/Sidoarjo dalam waktu ±60-75 menit dari base workshop kami.',
  },
  {
    question: 'Bagaimana jika lokasi saya berada di kecamatan yang belum tertera di daftar?',
    answer: 'Daftar di atas adalah area prioritas kami. Jika lokasi proyek Anda berada di area sekitar Jawa Timur (seperti Mojokerto, Kediri, Blitar, Probolinggo), silakan hubungi tim kami via WhatsApp. Kami dengan senang hati meninjau kelayakan dan skala proyek Anda!',
  },
] as const;
