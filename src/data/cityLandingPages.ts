/**
 * @file cityLandingPages.ts
 * @description Dataset master untuk Programmatic SEO Multi-Landing Page Jasa Konstruksi Jawa Timur.
 * Berisi konteks arsitektur lokal, rute logistik dari Base Malang, kecamatan/perumahan elit, estimasi RAB, dan FAQ terstruktur.
 */

export interface PriceTier {
  name: string;
  priceRange: string;
  targetUnit: string;
  description: string;
  specs: string[];
  popular?: boolean;
}

export interface CityFaq {
  question: string;
  answer: string;
}

export interface CityLandingData {
  slug: string; // e.g. "surabaya" -> /jasa-konstruksi-surabaya
  cityName: string;
  cityShort: string;
  regionType: 'Kota' | 'Kabupaten' | 'Kawasan';
  heroHeadline: string;
  heroSubheadline: string;
  badgeText: string;
  travelTime: string;
  tollRoute: string;
  projectCountText: string;
  localChallengeTitle: string;
  localChallengeDesc: string;
  localSolutionTitle: string;
  localSolutionDesc: string;
  districts: string[];
  priceTiers: PriceTier[];
  faqs: CityFaq[];
  geo: {
    lat: number;
    lng: number;
  };
  sampleProjectSlugs: string[];
  whatsappMessage: string;
}

export const CITY_LANDING_PAGES: CityLandingData[] = [
  {
    slug: 'surabaya',
    cityName: 'Surabaya',
    cityShort: 'Surabaya',
    regionType: 'Kota',
    heroHeadline: 'Jasa Konstruksi & Bangun Rumah di Surabaya Berstandar SNI',
    heroSubheadline:
      'Solusi terpadu pembangunan rumah tinggal mewah, renovasi ruko, dan arsitektur komersial di Surabaya. Perencanaan 3D presisi, RAB transparan tanpa biaya tersembunyi, dan mobilisasi cepat tim ahli via Tol Trans-Jawa.',
    badgeText: 'KORIDOR PRIORITAS SURABAYA METROPOLITAN',
    travelTime: '± 70 - 75 Menit',
    tollRoute: 'Akses Langsung Tol Pandaan - Malang & Tol Surabaya - Gempol (Gerbang Waru / Gunungsari)',
    projectCountText: '45+ Proyek Terlaksana di Koridor Surabaya & Sekitarnya',
    localChallengeTitle: 'Tantangan Arsitektur Surabaya: Panas Pesisir, Kelembapan & Daya Dukung Tanah Lunak',
    localChallengeDesc:
      'Wilayah Surabaya memiliki iklim tropis pesisir dengan intensitas panas matahari tinggi dan sebagian kawasan memiliki muka air tanah dangkal. Pembangunan tanpa perhitungan struktur matang berisiko retak rambut, dinding lembap/berjamur, dan ruangan terasa pengap.',
    localSolutionTitle: 'Solusi Rancang Bangun Bina Project untuk Iklim Surabaya',
    localSolutionDesc:
      'Kami menerapkan arsitektur tropis kontemporer dengan sistem ventilasi silang (cross-ventilation), bukaan cahaya alami terlindung (sun shading), pondasi strauss pile/bored pile berstandar tanah Surabaya, serta lapisan waterproofing elastomeric pada dak beton untuk proteksi anti-bocor 100%.',
    districts: [
      'CitraLand (Surabaya Barat)',
      'Pakuwon City (Surabaya Timur)',
      'Graha Famili & Dian Istana',
      'Dharmahusada & Kertajaya',
      'Wiyung & Lakarsantri',
      'Rungkut & Merr',
      'Wonokromo & Darmo',
      'Sukolilo & Mulyorejo',
      'Sambikerep & Lontar',
      'Kenjeran & Tambaksari',
    ],
    priceTiers: [
      {
        name: 'Standar Berkualitas (SNI)',
        priceRange: 'Rp 3.800.000 - Rp 4.500.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Pilihan ekonomis ideal untuk rumah tinggal keluarga muda dengan material pilihan bersertifikasi SNI.',
        specs: [
          'Struktur beton bertulang besi ulir SNI',
          'Dinding bata ringan (hebel) plester aci semen instan',
          'Rangka atap baja ringan galvalum C75 tebal 0.75mm',
          'Penutup atap genteng beton flat / metal berpasir',
          'Lantai homogen / granit tile 60x60 cm',
          'Kusen aluminium 3 inch & pintu solid engineering',
          'Sanitair standar American Standard / setara',
          'Garansi pemeliharaan kebocoran & struktur resmi',
        ],
      },
      {
        name: 'Premium Modern Tropis',
        priceRange: 'Rp 4.800.000 - Rp 6.200.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Paket terfavorit untuk hunian modern kontemporer dengan fasad mewah, kisi-kisi estetis, dan plafon tinggi.',
        specs: [
          'Seluruh spesifikasi paket standar ditingkatkan',
          'Desain fasad arsitektur modern (kombinasi travertine/WPC)',
          'Plafon gypsum drop ceiling dengan ambient warm lighting',
          'Kusen aluminium 4 inch powder coating Alexindo / setara',
          'Lantai granit tile ukuran besar 80x80 / 60x120 cm',
          'Sanitair Toto / Grohe dengan instalasi air panas pipa PPR',
          'Waterproofing membran bakar pada seluruh dak beton',
          'Instalasi kelistrikan Schneider + panel proteksi MCB',
        ],
        popular: true,
      },
      {
        name: 'Luxury Custom Villa & Estate',
        priceRange: 'Rp 6.800.000 - Rp 8.500.000+',
        targetUnit: 'per m² luas bangunan',
        description: 'Standar kemewahan tertinggi untuk rumah tapak prestisius dengan material impor, marmer, dan smart home ready.',
        specs: [
          'Struktur pondasi dalam bored pile / tiang pancang presisi',
          'Finishing lantai marmer slab lokal / impor premium',
          'Fasad kaca tempered laminasi & sistem kisi aluminium aerofoil',
          'Smart Home Automation ready (lighting, CCTV, access door)',
          'Sanitair premium Kohler / Toto Neorest',
          'Kolam renang privat / rooftop terrace water feature',
          'Desain interior terintegrasi & custom kitchen set workshop',
          'Pengawasan harian oleh Site Engineer & Arsitek Senior',
        ],
      },
    ],
    faqs: [
      {
        question: 'Apakah Bina Project melayani survei tapak langsung ke Surabaya?',
        answer:
          'Ya, tim arsitek dan estimator kami melayani survei tapak langsung ke seluruh wilayah Surabaya (Barat, Timur, Selatan, Pusat, dan Utara). Jadwal survei dikoordinasikan secara fleksibel sesuai waktu luang Anda.',
      },
      {
        question: 'Bagaimana sistem pengerjaan proyek di Surabaya padahal kantor pusat di Malang?',
        answer:
          'Inilah keunggulan sistem Bina Project: pekerjaan perencanaan 3D visual, perhitungan struktur, dan prefabrikasi interior dikerjakan di studio/workshop Malang dengan kontrol mutu tinggi. Saat konstruksi dimulai, tim mandor, logistik armada, dan tukang spesialis kami standby penuh di lokasi proyek Surabaya didukung supervisi arsitek lapangan secara berkala via Tol Trans-Jawa (hanya 70 menit perjalanan).',
      },
      {
        question: 'Bagaimana sistem pembayaran proyek bangun rumah di Surabaya?',
        answer:
          'Sistem pembayaran menggunakan termin bertahap transparan yang tertuang dalam Surat Perjanjian Kerja (SPK) resmi. Pembayaran dilakukan sesuai progres fisik lapangan yang diverifikasi bersama melalui Berita Acara Opname Progres (misal termin 1 pondasi, termin 2 struktur lantai 1, dst). Kami tidak meminta pelunasan di muka.',
      },
      {
        question: 'Apakah ada garansi setelah rumah selesai dibangun?',
        answer:
          'Pasti. Setiap proyek konstruksi Bina Project dilindungi Surat Jaminan Garansi resmi yang mencakup garansi pemeliharaan kebocoran dak beton, instalasi air/listrik, serta integritas struktur bangunan.',
      },
    ],
    geo: {
      lat: -7.2575,
      lng: 112.7521,
    },
    sampleProjectSlugs: ['rosana', 'rosana-collection', 'villa', 'cafe-batu'],
    whatsappMessage:
      'Halo Bina Project, saya ingin konsultasi jasa konstruksi bangun / renovasi rumah di wilayah Surabaya...',
  },
  {
    slug: 'sidoarjo',
    cityName: 'Sidoarjo',
    cityShort: 'Sidoarjo',
    regionType: 'Kabupaten',
    heroHeadline: 'Jasa Konstruksi & Kontraktor Renovasi Rumah di Sidoarjo',
    heroSubheadline:
      'Wujudkan hunian idaman di kawasan berkembang Sidoarjo & Waru dengan arsitektur elegan, spesifikasi material kokoh, dan RAB transparan tanpa pembengkakan biaya.',
    badgeText: 'KORIDOR PRIORITAS SIDOARJO & WARU',
    travelTime: '± 55 - 60 Menit',
    tollRoute: 'Akses Langsung Tol Pandaan - Malang & Tol Surabaya - Porong (Pintu Tol Sidoarjo / Tanggulangin)',
    projectCountText: '35+ Proyek Terlaksana di Area Sidoarjo & Sekitarnya',
    localChallengeTitle: 'Karakteristik Wilayah Sidoarjo: Penataan Saluran Air & Pemilihan Pondasi',
    localChallengeDesc:
      'Sebagian kawasan pemukiman di Sidoarjo memiliki karakteristik tanah lempung dan elevasi jalan yang bertahap meninggi. Kesalahan pemilihan peil lantai (elevasi dasar) sering mengakibatkan air hujan masuk ke dalam rumah di kemudian hari.',
    localSolutionTitle: 'Solusi Rekayasa Pondasi & Elevasi Aman dari Bina Project',
    localSolutionDesc:
      'Sebelum pengerjaan struktur, tim estimator kami melakukan pengukuran peil jalan eksisting untuk menetapkan elevasi lantai rumah yang aman dari banjir genangan. Pondasi dirancang memakai cerucuk/strauss pile berpenulangan rapat untuk mencegah penurunan tanah diferensial.',
    districts: [
      'Waru & Tropodo',
      'Pondok Tjandra Indah',
      'Puri Surya Jaya (Gedangan)',
      'Kahuripan Nirwana',
      'Sidoarjo Kota & Magersari',
      'Candi & Tanggulangin',
      'Sedati & Juanda',
      'Taman & Sepanjang',
      'Buduran & Sawohan',
      'Sukodono & Krian',
    ],
    priceTiers: [
      {
        name: 'Standar SNI Sidoarjo',
        priceRange: 'Rp 3.750.000 - Rp 4.400.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Pilihan hemat dan kokoh untuk rumah tumbuh maupun renovasi total di perumahan Sidoarjo.',
        specs: [
          'Pondasi footplat / strauss pile anti-amblas',
          'Struktur beton bertulang SNI',
          'Dinding bata ringan plester aci rapi',
          'Rangka atap baja ringan galvalum tebal',
          'Lantai granit tile 60x60 cm mulus',
          'Kusen aluminium 3 inch & sanitair SNI',
          'Garansi pemeliharaan resmi tertulis di SPK',
        ],
      },
      {
        name: 'Modern Residensial Premium',
        priceRange: 'Rp 4.750.000 - Rp 5.900.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Paket hunian idaman dengan tampilan fasad kontemporer, plafon tinggi, dan pencahayaan estetik.',
        specs: [
          'Peninggian peil lantai minimal +60 cm dari jalan',
          'Fasad modern kombinasi semen ekspos & kisi WPC',
          'Plafon gypsum drop ceiling lampu warm hidden',
          'Kusen aluminium Alexindo 4 inch kedap suara',
          'Lantai granit tile 80x80 cm motif marmer elegan',
          'Sanitair Toto lengkap dengan shower set',
          'Waterproofing dak beton 3 lapis serat fiber',
        ],
        popular: true,
      },
      {
        name: 'Mewah / Luxury Custom',
        priceRange: 'Rp 6.500.000 - Rp 8.000.000+',
        targetUnit: 'per m² luas bangunan',
        description: 'Konstruksi estate eksklusif untuk hunian mandiri dengan spesifikasi material kelas atas.',
        specs: [
          'Struktur pondasi dalam dirancang insinyur sipil berpengalaman',
          'Finishing lantai marmer / granit slab premium',
          'Fasad kaca tempered tebal & material pintu kayu jati solid',
          'Instalasi smart home, solar water heater ready',
          'Kitchen set custom & wardrobe terintegrasi dari workshop',
          'Pengawasan harian intensif oleh Project Manager',
        ],
      },
    ],
    faqs: [
      {
        question: 'Apakah bisa renovasi peninggian rumah di Sidoarjo tanpa membongkar total?',
        answer:
          'Bisa. Tim teknik Bina Project akan melakukan audit kekuatan struktur kolom dan pondasi lama terlebih dahulu. Jika struktur eksisting masih prima, kami dapat merancang renovasi parsial peninggian peil lantai dan peremajaan fasad yang jauh lebih hemat biaya dibanding bongkar total.',
      },
      {
        question: 'Berapa lama estimasi pembangunan rumah 2 lantai di Sidoarjo?',
        answer:
          'Untuk rumah 2 lantai luas 120-200 m², rata-rata durasi pengerjaan adalah 4 hingga 6 bulan kalender. Timeline pengerjaan dilengkapi kurva S mingguan sehingga progres terukur dan serah terima kunci tepat waktu.',
      },
      {
        question: 'Apakah saya mendapatkan gambar desain 3D dan denah arsitektur?',
        answer:
          'Tentu. Anda akan mendapatkan paket lengkap: Gambar Denah Tata Ruang, 3D Visual Realistis Eksterior & Interior, Gambar Kerja DED (Detail Engineering Design), serta Rencana Anggaran Biaya (RAB) terperinci.',
      },
    ],
    geo: {
      lat: -7.4478,
      lng: 112.7183,
    },
    sampleProjectSlugs: ['rosana', 'kitchen-set', 'villa', 'sdi-nur-multazam'],
    whatsappMessage:
      'Halo Bina Project, saya ingin konsultasi bangun / renovasi rumah di area Sidoarjo...',
  },
  {
    slug: 'gresik',
    cityName: 'Gresik',
    cityShort: 'Gresik',
    regionType: 'Kabupaten',
    heroHeadline: 'Jasa Konstruksi Bangun Rumah & Renovasi di Gresik',
    heroSubheadline:
      'Layanan kontraktor profesional untuk rumah tinggal, ruko, dan fasilitas komersial di kawasan Gresik, Driyorejo, dan Menganti. Struktur tahan gempa dengan efisiensi biaya maksimal.',
    badgeText: 'KORIDOR EKONOMI GRESIK & SEKITARNYA',
    travelTime: '± 80 - 90 Menit',
    tollRoute: 'Akses Tol Trans-Jawa / Tol Surabaya - Gresik & KLBM (Krian - Legundi - Bunder - Manyar)',
    projectCountText: '20+ Proyek Terlaksana di Kawasan Gresik',
    localChallengeTitle: 'Tantangan Wilayah Gresik: Hawa Terik Industri & Struktur Tanah Berkapur / Liat',
    localChallengeDesc:
      'Sebagai kawasan industri dan pesisir utara, Gresik menuntut material konstruksi yang tahan panas, bebas korosi, dan pondasi yang mampu mencengkeram tanah liat ekspansif di beberapa kawasan perbukitan kapur.',
    localSolutionTitle: 'Solusi Bangunan Sejuk & Pondasi Mantap dari Bina Project',
    localSolutionDesc:
      'Kami mendesain atap dengan kemiringan optimal dan ventilasi bubungan penurun suhu, serta insulasi peredam panas di bawah genteng. Struktur pondasi didesain dengan perkuatan sloof ikat ganda agar bangunan tidak mengalami retak struktur akibat pergerakan tanah.',
    districts: [
      'Gresik Kota & Kebomas',
      'Manyar & Kawasan JIIPE',
      'Menganti & Hulaan',
      'Driyorejo & Kota Baru Driyorejo',
      'Cerme & Benjeng',
      'Duduksampeyan',
      'Kedamean',
      'Bungah & Sidayu',
    ],
    priceTiers: [
      {
        name: 'Standar Kokoh SNI',
        priceRange: 'Rp 3.800.000 - Rp 4.500.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Solusi efisien untuk rumah tinggal di perumahan Menganti dan Driyorejo.',
        specs: [
          'Pondasi tapak cakar ayam beton bertulang SNI',
          'Sloof ikat ganda anti-retak tanah',
          'Dinding bata ringan plester aci',
          'Rangka atap galvalum anti-rayap',
          'Lantai granit 60x60 cm',
          'Kusen aluminium anti-korosi',
          'Garansi resmi SPK',
        ],
      },
      {
        name: 'Modern Tropis Sejuk',
        priceRange: 'Rp 4.800.000 - Rp 6.000.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Paket hunian adem dengan insulasi panas dan fasad minimalis kontemporer.',
        specs: [
          'Insulasi alumunium foil bubble peredam panas di bawah atap',
          'Bukaan jendela lebar sirkulasi silang',
          'Fasad modern kombinasi kisi-kisi dan batu alam',
          'Plafon gypsum drop ceiling',
          'Lantai granit tile 80x80 cm',
          'Sanitair Toto lengkap instalasi air bersih',
        ],
        popular: true,
      },
      {
        name: 'Komersial & Custom Estate',
        priceRange: 'Rp 6.500.000 - Rp 8.000.000+',
        targetUnit: 'per m² luas bangunan',
        description: 'Untuk ruko usaha bertingkat atau hunian eksklusif dengan spesifikasi custom.',
        specs: [
          'Struktur beton mutu tinggi K-300 / K-350',
          'Struktur bentang lebar bebas kolom',
          'Pintu kaca tempered / rolling door otomatis',
          'Finishing granit slab / marmer',
          'Instalasi genset & kelistrikan 3-phase ready',
        ],
      },
    ],
    faqs: [
      {
        question: 'Apakah melayani pembangunan di kawasan Menganti dan Driyorejo?',
        answer:
          'Sangat bisa. Menganti dan Driyorejo merupakan koridor aktif yang sangat mudah diakses via jalan tol KLBM dan tol Sumo. Tim kami siap melakukan survei lokasi langsung ke kavling Anda.',
      },
      {
        question: 'Bisa kah Bina Project membantu pengurusan IMB / PBG di Gresik?',
        answer:
          'Bisa. Seluruh gambar teknis arsitektur, struktur, dan MEP (Mekanikal Elektrikal Plumbing) yang kami buat telah memenuhi standar gambar kerja yang dipersyaratkan untuk pengurusan Persetujuan Bangunan Gedung (PBG) di dinas terkait.',
      },
    ],
    geo: {
      lat: -7.1566,
      lng: 112.6555,
    },
    sampleProjectSlugs: ['rosana', 'villa', 'kitchen-set', 'cafe-batu'],
    whatsappMessage:
      'Halo Bina Project, saya ingin konsultasi pembangunan rumah / ruko di kawasan Gresik...',
  },
  {
    slug: 'pasuruan',
    cityName: 'Pasuruan & Pandaan',
    cityShort: 'Pasuruan',
    regionType: 'Kawasan',
    heroHeadline: 'Jasa Kontraktor Bangun Rumah & Villa di Pasuruan - Pandaan',
    heroSubheadline:
      'Spesialis pembangunan villa pegunungan sejuk di Pandaan/Prigen dan rumah hunian modern di Kota Pasuruan & Bangil. Mobilisasi kilat dari Base Malang hanya 35-45 menit.',
    badgeText: 'KORIDOR PRIORITAS UTAMA (35 - 45 MENIT DARI BASE)',
    travelTime: '± 35 - 45 Menit',
    tollRoute: 'Akses Langsung Tol Pandaan - Malang (Pintu Tol Purwodadi, Pandaan, & Sukorejo)',
    projectCountText: '38+ Proyek Terealisasi di Pasuruan, Pandaan & Prigen',
    localChallengeTitle: 'Karakteristik Wilayah Pasuruan: Kontur Lereng di Pandaan & Suhu Hangat di Pesisir',
    localChallengeDesc:
      'Kawasan Pandaan dan Prigen menuntut rekayasa kemiringan lereng (kontur tanah) yang aman dari bahaya longsor, sedangkan Kota Pasuruan memerlukan material yang tahan terhadap paparan cuaca terik pesisir.',
    localSolutionTitle: 'Keahlian Rekayasa Dinding Penahan Tanah & Fasad Estetik',
    localSolutionDesc:
      'Bina Project berpengalaman dalam pembuatan Retaining Wall (dinding penahan tanah batu kali / beton bertulang) berdrainase baik untuk villa berhawa sejuk di Pandaan, serta konstruksi rumah modern berkanopi lebar untuk area Pasuruan kota.',
    districts: [
      'Pandaan & The Taman Dayu',
      'Prigen & Tretes',
      'Bangil & Beji',
      'Kota Pasuruan (Panggungrejo, Purworejo, Gadingrejo)',
      'Purwosari & Purwodadi',
      'Sukorejo & Gempol',
      'Kraton & Pohjentrek',
      'Rejoso & Grati',
    ],
    priceTiers: [
      {
        name: 'Standar Pasuruan SNI',
        priceRange: 'Rp 3.700.000 - Rp 4.400.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Konstruksi rumah tinggal keluarga dengan bahan berkualitas dan garansi pemeliharaan.',
        specs: [
          'Pondasi batu kali + sloof beton bertulang SNI',
          'Dinding bata merah / bata ringan aci halus',
          'Rangka atap galvalum tebal SNI',
          'Lantai granit tile 60x60 cm',
          'Kusen aluminium 3 inch',
          'Sanitair standar berkualitas',
        ],
      },
      {
        name: 'Villa Tropis & Modern Kontemporer',
        priceRange: 'Rp 4.700.000 - Rp 6.000.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Paket terfavorit untuk villa pegunungan di Pandaan/Prigen atau hunian bergaya tropis.',
        specs: [
          'Desain split level mengikuti kontur lereng alami',
          'Bukaan kaca lebar untuk panorama pemandangan pegunungan',
          'Fasad aksen batu alam andesit & kisi-kisi kayu/WPC',
          'Lantai granit 80x80 cm tahan cuaca lembap',
          'Sanitair Toto lengkap instalasi water heater',
          'Teras outdoor & decking santai',
        ],
        popular: true,
      },
      {
        name: 'Luxury Villa & Resort',
        priceRange: 'Rp 6.500.000 - Rp 8.500.000+',
        targetUnit: 'per m² luas bangunan',
        description: 'Standar kemewahan villa privat dengan infinity pool dan material arsitektur eksklusif.',
        specs: [
          'Rekayasa retaining wall bertulang pondasi cakar ayam dalam',
          'Finishing marmer slab & kayu ulin outdoor',
          'Kolam renang infinity view pegunungan',
          'Custom interior & kitchen set fabrikasi workshop',
          'Sistem pencahayaan lanskap malam hari',
        ],
      },
    ],
    faqs: [
      {
        question: 'Mengapa memilih Bina Project untuk proyek di Pandaan dan Pasuruan?',
        answer:
          'Lokasi Base Workshop kami di Malang hanya berjarak 35-45 menit via Tol Pandaan-Malang. Akses yang sangat dekat ini memungkinkan mobilisasi material, tim arsitek, dan pengawasan berkala berlangsung sangat intensif dan efisien tanpa membebani biaya klien.',
      },
      {
        question: 'Apakah Bina Project sudah memiliki portofolio proyek riil di Pasuruan?',
        answer:
          'Sudah sangat banyak. Kami telah menyelesaikan proyek seperti Rosana Residence (Pasuruan), Rosana Collection Store (Pasuruan), custom kitchen set di berbagai perumahan, hingga villa di kawasan lereng Pandaan.',
      },
    ],
    geo: {
      lat: -7.6534,
      lng: 112.6955,
    },
    sampleProjectSlugs: ['rosana', 'rosana-collection', 'kitchen-set', 'villa'],
    whatsappMessage:
      'Halo Bina Project, saya ingin konsultasi bangun rumah / villa di kawasan Pasuruan / Pandaan...',
  },
  {
    slug: 'batu',
    cityName: 'Kota Batu',
    cityShort: 'Batu',
    regionType: 'Kota',
    heroHeadline: 'Jasa Arsitek & Kontraktor Bangun Villa Mewah di Kota Batu',
    heroSubheadline:
      'Spesialis pembangunan villa peristirahatan, homestay komersial, dan hunian sejuk di Kota Batu. Ahli rancang bangun kontur lereng, bukaan panorama pegunungan, dan garansi struktur kokoh.',
    badgeText: 'AREA BASE OPERASIONAL UTAMA (< 30 MENIT)',
    travelTime: '± 20 - 30 Menit',
    tollRoute: 'Akses Jalur Arteri Malang - Batu (Akses Langsung Harian)',
    projectCountText: '50+ Proyek Villa & Homestay Terealisasi di Kota Batu',
    localChallengeTitle: 'Karakteristik Kota Batu: Kontur Berundak, Suhu Dingin & Beban Wisatawan',
    localChallengeDesc:
      'Pembangunan di Kota Batu didominasi lahan berkontur lereng dengan suhu udara sejuk berkabut. Bangunan villa yang salah rancang rentan mengalami dinding berjamur, air merembes dari tebing tanah, dan ruangan terasa sangat lembap.',
    localSolutionTitle: 'Desain Villa Bernilai Sewa Tinggi & Tahan Cuaca Pegunungan',
    localSolutionDesc:
      'Kami merancang struktur bertingkat (split-level) yang mengikuti kontur alami tanpa merusak tanah. Dinding dilengkapi waterproofing ganda, insulasi lantai hangat, serta bukaan kaca berorientasi ke arah Gunung Panderman atau Arjuno untuk memaksimalkan daya tarik sewa komersial.',
    districts: [
      'Bumiaji & Punten',
      'Junrejo & Beji',
      'Kecamatan Batu (Sisir, Temas, Ngaglik)',
      'Oro-Oro Ombo (Dekat Jatim Park / BNS)',
      'Songgokerto & Payung',
      'Sumberejo & Gunungsari',
      'Pesanggrahan',
    ],
    priceTiers: [
      {
        name: 'Hunian Sejuk Batu',
        priceRange: 'Rp 3.800.000 - Rp 4.500.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Rumah tinggal keluarga yang nyaman dan tahan cuaca dingin pegunungan.',
        specs: [
          'Pondasi cakar ayam bertulang SNI',
          'Dinding bata merah/hebel plester kedap air',
          'Atap galvalum tebal dengan insulasi anti-berisik',
          'Lantai granit tile 60x60 cm',
          'Sanitair standar dengan jalur pipa air panas',
        ],
      },
      {
        name: 'Modern Villa & Homestay Estetik',
        priceRange: 'Rp 4.900.000 - Rp 6.200.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Paling diminati investor untuk villa disewakan (Airbnb/homestay) berdaya tarik visual tinggi.',
        specs: [
          'Desain arsitektur modern tropis / industrial aesthetic',
          'Bukaan kaca panorama framing aluminium tebal',
          'Fasad aksen batu alam paras / andesit & kisi WPC',
          'Rooftop deck pemandangan gunung 360 derajat',
          'Sanitair Toto lengkap water heater & rain shower',
          'Pencahayaan malam estetik ramah foto Instagram',
        ],
        popular: true,
      },
      {
        name: 'Luxury Private Villa & Heated Pool',
        priceRange: 'Rp 6.800.000 - Rp 8.800.000+',
        targetUnit: 'per m² luas bangunan',
        description: 'Villa prestisius dengan kolam renang privat air hangat dan interior mewah siap huni.',
        specs: [
          'Rekayasa retaining wall tebing kokoh berdrainase sub-surface',
          'Kolam renang air hangat (heat pump ready)',
          'Finishing lantai kayu ulin decking & marmer',
          'Custom interior & kitchen set full HPL workshop',
          'Sistem perapian / fireplace dekoratif modern',
        ],
      },
    ],
    faqs: [
      {
        question: 'Apakah survei tapak ke Kota Batu gratis?',
        answer:
          'Ya, survei tapak ke seluruh kawasan Kota Batu (Bumiaji, Junrejo, Sisir, Oro-Oro Ombo) adalah 100% GRATIS tanpa ikatan karena Kota Batu berada tepat berdampingan dengan base kantor & workshop kami di Malang.',
      },
      {
        question: 'Bisa kah membantu menghitung potensi Return of Investment (ROI) villa sewa?',
        answer:
          'Bisa. Dengan pengalaman membangun puluhan villa dan kafe komersial di Batu, kami dapat memberikan masukan denah kamar tidur dan fasilitas yang paling disukai wisatawan agar tarif sewa harian villa Anda maksimal.',
      },
    ],
    geo: {
      lat: -7.8712,
      lng: 112.5271,
    },
    sampleProjectSlugs: ['villa', 'cafe-batu', 'rosana', 'kitchen-set'],
    whatsappMessage:
      'Halo Bina Project, saya ingin konsultasi pembangunan villa / rumah di Kota Batu...',
  },
  {
    slug: 'malang',
    cityName: 'Malang Raya',
    cityShort: 'Malang',
    regionType: 'Kota',
    heroHeadline: 'Jasa Konstruksi Bangun & Renovasi Rumah Profesional di Malang',
    heroSubheadline:
      'Studio arsitektur dan kontraktor fisik terpercaya di Kota Malang, Kabupaten Malang, dan sekitarnya. Base workshop mandiri, tim tukang berpengalaman, legalitas SPK resmi, dan garansi tertulis.',
    badgeText: 'KANTOR PUSAT & WORKSHOP RESMI (LOWOKWARU, MALANG)',
    travelTime: '0 Menit (Base Operasional Langsung)',
    tollRoute: 'Kantor Pusat & Studio Jl. Watumujur II No.6 Lowokwaru, Kota Malang',
    projectCountText: '95+ Proyek Terealisasi di Malang Raya',
    localChallengeTitle: 'Kebutuhan Hunian di Malang: Estetika Arsitektur, Efisiensi Energi & Kualitas Struktur',
    localChallengeDesc:
      'Sebagai kota pendidikan dan hunian favorit, pemilik rumah di Malang menginginkan rumah yang tidak hanya kokoh secara struktur, tetapi juga memiliki tata ruang fungsional, pencahayaan alami maksimal, dan biaya perawatan rendah.',
    localSolutionTitle: 'Pelayanan Lengkap Arsitek Studio & Fabrikasi Workshop Terpadu',
    localSolutionDesc:
      'Di Base Malang, Anda bisa berkonsultasi tatap muka langsung di studio kami, meninjau contoh material di workshop, dan melihat langsung proyek-proyek yang sedang berjalan di berbagai sudut kota Malang.',
    districts: [
      'Lowokwaru (Ketawanggede, Soekarno-Hatta, Dinoyo)',
      'Klojen (Ijen, Oro-oro Dowo, Rampal)',
      'Blimbing (Araya, Sulfat, Pandanwangi)',
      'Sukun (Bandulan, Kebonsari, Gadang)',
      'Kedungkandang (Sawojajar, Buring, Lesanpuro)',
      'Singosari & Lawang (Akses Tol)',
      'Dau & Karangploso',
      'Pakis & Tumpang',
      'Kepanjen & Wagir',
    ],
    priceTiers: [
      {
        name: 'Standar SNI Malang',
        priceRange: 'Rp 3.600.000 - Rp 4.300.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Paket efisien untuk pembangunan rumah baru atau renovasi di perumahan Malang.',
        specs: [
          'Pondasi batu kali + strauss pile bertulang SNI',
          'Dinding bata ringan / bata merah plester aci semen instan',
          'Rangka atap galvalum tebal 0.75mm anti karat',
          'Lantai granit tile 60x60 cm',
          'Kusen aluminium 3 inch',
          'Sanitair standar SNI berkualitas',
          'Garansi struktur & pemeliharaan resmi',
        ],
      },
      {
        name: 'Modern Kontemporer Favorit',
        priceRange: 'Rp 4.600.000 - Rp 5.800.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Paket paling populer dengan fasad arsitektur modern, plafon tinggi sejuk, dan pencahayaan estetik.',
        specs: [
          'Fasad modern kombinasi semen ekspos / kisi WPC / batu alam',
          'Plafon gypsum drop ceiling lampu warm hidden',
          'Kusen aluminium 4 inch powder coating rapi',
          'Lantai granit tile 80x80 cm',
          'Sanitair Toto lengkap dengan instalasi air panas',
          'Waterproofing dak beton elastomeric garansi bocor',
        ],
        popular: true,
      },
      {
        name: 'Mewah / Luxury Architectural',
        priceRange: 'Rp 6.300.000 - Rp 8.200.000+',
        targetUnit: 'per m² luas bangunan',
        description: 'Standar rumah mewah eksklusif di kawasan elit (Ijen, Araya, Puncak Dieng, Permata Jingga).',
        specs: [
          'Struktur pondasi dalam dirancang khusus insinyur sipil',
          'Finishing marmer slab lokal / impor premium',
          'Fasad kaca tempered tebal & pintu kayu solid',
          'Smart home lighting & access automation',
          'Custom kitchen set & interior terpadu workshop kami',
          'Supervisi ketat harian oleh Arsitek Senior',
        ],
      },
    ],
    faqs: [
      {
        question: 'Apakah bisa berkunjung langsung ke kantor dan workshop Bina Project di Malang?',
        answer:
          'Sangat bisa! Kantor studio dan workshop kami beralamat di Jl. Watumujur II No.6, Ketawanggede, Lowokwaru, Kota Malang. Anda dipersilakan datang untuk berdiskusi langsung dengan tim arsitek kami sambil melihat workshop fabrikasi kami.',
      },
      {
        question: 'Apakah survei lokasi ke kawasan Malang Raya dikenakan biaya?',
        answer:
          'Survei tapak ke seluruh wilayah Kota Malang, Kabupaten Malang, dan Kota Batu adalah 100% GRATIS tanpa dipungut biaya apapun.',
      },
      {
        question: 'Apakah melayani renovasi skala kecil di Malang?',
        answer:
          'Kami melayani renovasi mulai dari renovasi fasad, penambahan lantai 2, perbaikan atap bocor, hingga renovasi total rumah tinggal.',
      },
    ],
    geo: {
      lat: -7.9498,
      lng: 112.6088,
    },
    sampleProjectSlugs: ['sdi-nur-multazam', 'kitchen-set-dr-irfan', 'villa', 'cafe-batu'],
    whatsappMessage:
      'Halo Bina Project, saya ingin konsultasi bangun / renovasi rumah di wilayah Malang...',
  },
  {
    slug: 'kediri',
    cityName: 'Kediri',
    cityShort: 'Kediri',
    regionType: 'Kota',
    heroHeadline: 'Jasa Kontraktor Bangun & Renovasi Rumah di Kediri',
    heroSubheadline:
      'Layanan konstruksi dan renovasi rumah tinggal modern di Kota & Kabupaten Kediri. Standar pengerjaan presisi arsitek, material SNI pilihan, dan sistem pembayaran termin aman bergaransi.',
    badgeText: 'KORIDOR PERTUMBUHAN KEDIRI RAYA',
    travelTime: '± 80 - 90 Menit',
    tollRoute: 'Akses Rute Malang - Pujon - Kandangan - Pare - Kediri Kota',
    projectCountText: '18+ Proyek Terlaksana di Wilayah Kediri & Sekitarnya',
    localChallengeTitle: 'Pertumbuhan Pesat Kediri: Bandara Dhoho & Kebutuhan Properti Berkualitas',
    localChallengeDesc:
      'Dengan beroperasinya Bandara Internasional Dhoho Kediri, nilai properti dan tuntutan kualitas bangunan di Kediri meningkat drastis. Pemilik rumah dan investor membutuhkan kontraktor yang mampu mewujudkan desain modern berstandar kota besar.',
    localSolutionTitle: 'Desain Berkelas Arsitektur Malang dengan Eksekusi Lapangan Rapi',
    localSolutionDesc:
      'Bina Project menghadirkan standar mutu arsitektur studio ke Kediri: desain 3D detail, gambar kerja lengkap, serta pengawasan mutu ketat sehingga bangunan memiliki nilai jual dan prestise tinggi.',
    districts: [
      'Mojoroto & Bandar Kidul',
      'Kecamatan Kota (Dermo, Semampir, Pakelan)',
      'Pesantren & Burengan',
      'Pare & Sekitarnya (Kawasan Kampung Inggris)',
      'Gampengrejo & Ngasem (Dekat SLG)',
      'Badas & Gurah',
      'Wates & Kandat',
    ],
    priceTiers: [
      {
        name: 'Standar SNI Kediri',
        priceRange: 'Rp 3.700.000 - Rp 4.400.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Paket hemat berkualitas untuk rumah tinggal keluarga di Kediri.',
        specs: [
          'Pondasi batu kali + cakar ayam bertulang SNI',
          'Dinding bata ringan / merah plester aci',
          'Rangka atap baja ringan galvalum',
          'Lantai granit 60x60 cm',
          'Kusen aluminium 3 inch & sanitair SNI',
          'Garansi pemeliharaan tertulis',
        ],
      },
      {
        name: 'Modern Minimalis Estetis',
        priceRange: 'Rp 4.700.000 - Rp 5.900.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Paling diminati untuk hunian keluarga modern dengan fasad estetik dan sirkulasi udara sejuk.',
        specs: [
          'Fasad modern kombinasi kisi-kisi dan aksen batu alam',
          'Plafon gypsum drop ceiling dengan warm lighting',
          'Kusen aluminium 4 inch Alexindo',
          'Lantai granit tile 80x80 cm',
          'Sanitair Toto lengkap shower & pipa air panas',
          'Waterproofing dak beton 3 lapis',
        ],
        popular: true,
      },
      {
        name: 'Luxury Residence & Commercial',
        priceRange: 'Rp 6.400.000 - Rp 7.900.000+',
        targetUnit: 'per m² luas bangunan',
        description: 'Untuk rumah mewah, ruko komersial prestisius, atau kantor bisnis di Kediri.',
        specs: [
          'Struktur kokoh bentang lebar bebas kolom',
          'Finishing marmer slab & kaca tempered',
          'Smart home lighting ready',
          'Custom kitchen set & interior terpadu dari workshop',
          'Pengawasan ketat oleh Site Engineer',
        ],
      },
    ],
    faqs: [
      {
        question: 'Apakah tim Bina Project bersedia datang survei ke Kediri?',
        answer:
          'Tentu bersedia. Tim kami rutin melakukan survei tapak terjadwal ke Kediri, Pare, dan sekitarnya untuk pengukuran lahan dan konsultasi desain langsung.',
      },
      {
        question: 'Bagaimana akomodasi tukang untuk pengerjaan di Kediri?',
        answer:
          'Seluruh akomodasi tukang dan logistik armada telah terkelola secara mandiri dan transparan di dalam RAB tanpa ada biaya tambahan tak terduga bagi klien.',
      },
    ],
    geo: {
      lat: -7.8166,
      lng: 112.0119,
    },
    sampleProjectSlugs: ['rosana', 'villa', 'kitchen-set', 'sdi-nur-multazam'],
    whatsappMessage:
      'Halo Bina Project, saya ingin konsultasi bangun / renovasi rumah di area Kediri...',
  },
  {
    slug: 'mojokerto',
    cityName: 'Mojokerto',
    cityShort: 'Mojokerto',
    regionType: 'Kawasan',
    heroHeadline: 'Jasa Kontraktor Bangun Rumah & Ruko di Mojokerto',
    heroSubheadline:
      'Layanan konstruksi rumah tinggal, ruko, dan renovasi properti di Kota & Kabupaten Mojokerto. Rancang bangun arsitektur modern berstandar SNI dengan biaya transparan.',
    badgeText: 'KORIDOR STRATEGIS MOJOKERTO & SEKITARNYA',
    travelTime: '± 60 - 70 Menit',
    tollRoute: 'Akses Tol Pandaan - Malang disambung Tol Sumo / Arteri Mojokerto',
    projectCountText: '15+ Proyek Terlaksana di Area Mojokerto',
    localChallengeTitle: 'Karakteristik Mojokerto: Kawasan Pemukiman Asri & Koridor Usaha Maju',
    localChallengeDesc:
      'Mojokerto memiliki kawasan kota yang padat aktivitas usaha ruko serta pemukiman asri di kawasan lereng Pacet dan Trawas. Masing-masing membutuhkan pendekatan desain struktur dan fasad yang berbeda.',
    localSolutionTitle: 'Kombinasi Fungsional Komersial & Kehangatan Hunian Tropis',
    localSolutionDesc:
      'Bina Project mampu mengoptimalkan tata ruang ruko agar memiliki daya tampung usaha maksimal, sekaligus merancang rumah tinggal keluarga yang tenang, sejuk, dan hemat energi.',
    districts: [
      'Magersari & Kranggan',
      'Prajurit Kulon',
      'Puri & Kenanten',
      'Sooko & Brangkal',
      'Trowulan & Mojoanyar',
      'Pacet & Trawas (Area Villa)',
      'Ngoro & Bangsal',
      'Jetis & Gedeg',
    ],
    priceTiers: [
      {
        name: 'Standar SNI Mojokerto',
        priceRange: 'Rp 3.700.000 - Rp 4.400.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Paket efisien untuk pembangunan rumah tinggal keluarga di Mojokerto.',
        specs: [
          'Pondasi batu kali + cakar ayam bertulang SNI',
          'Dinding bata ringan / merah plester aci',
          'Rangka atap baja ringan galvalum',
          'Lantai granit 60x60 cm',
          'Kusen aluminium 3 inch',
          'Sanitair standar SNI',
          'Garansi struktur resmi',
        ],
      },
      {
        name: 'Modern Tropis Residensial',
        priceRange: 'Rp 4.700.000 - Rp 5.900.000',
        targetUnit: 'per m² luas bangunan',
        description: 'Paket hunian idaman dengan fasad estetik kontemporer dan sirkulasi sejuk.',
        specs: [
          'Fasad modern kombinasi batu alam dan kisi WPC',
          'Plafon gypsum drop ceiling dengan warm lighting',
          'Kusen aluminium 4 inch Alexindo',
          'Lantai granit tile 80x80 cm',
          'Sanitair Toto lengkap instalasi shower',
          'Waterproofing dak beton bertulang',
        ],
        popular: true,
      },
      {
        name: 'Villa Pacet/Trawas & Komersial',
        priceRange: 'Rp 6.300.000 - Rp 8.000.000+',
        targetUnit: 'per m² luas bangunan',
        description: 'Untuk villa sejuk di lereng Pacet/Trawas atau ruko bertingkat di pusat kota.',
        specs: [
          'Struktur beradaptasi dengan lereng pegunungan / bentang lebar ruko',
          'Bukaan kaca panorama view alam',
          'Finishing marmer / granit slab & decking outdoor',
          'Custom interior workshop kami',
        ],
      },
    ],
    faqs: [
      {
        question: 'Apakah melayani pembangunan villa di Pacet atau Trawas Mojokerto?',
        answer:
          'Sangat melayani. Kami terbiasa mengerjakan konstruksi villa lereng pegunungan dengan tantangan kontur tanah dan kebutuhan bukaan panorama pemandangan alam.',
      },
      {
        question: 'Berapa lama waktu survei dari kantor Malang ke Mojokerto?',
        answer:
          'Dengan akses jalan yang lancar, tim arsitek kami dapat mencapai lokasi Anda di Mojokerto dalam waktu sekitar 60 hingga 75 menit.',
      },
    ],
    geo: {
      lat: -7.4726,
      lng: 112.4385,
    },
    sampleProjectSlugs: ['villa', 'rosana', 'cafe-batu', 'kitchen-set'],
    whatsappMessage:
      'Halo Bina Project, saya ingin konsultasi bangun / renovasi rumah di area Mojokerto...',
  },
];

/**
 * Helper untuk mengambil data kota berdasarkan slug
 */
export function getCityLandingData(slug: string): CityLandingData | undefined {
  return CITY_LANDING_PAGES.find((c) => c.slug === slug);
}
