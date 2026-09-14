/**
 * @file faqs.ts
 * @description Single Source of Truth for frequently asked questions and FAQ schema generator.
 */

import type { FaqItem, FaqCategory } from '@types';

/** Category labels for the UI tabs */
export const FAQ_CATEGORIES: Record<FaqCategory, { label: string; icon: string }> = {
  biaya: { label: 'Biaya & Pembayaran', icon: 'solar:wallet-linear' },
  proses: { label: 'Proses & Timeline', icon: 'solar:clock-circle-linear' },
  material: { label: 'Material & Teknis', icon: 'solar:settings-linear' },
  garansi: { label: 'Garansi & Layanan', icon: 'solar:shield-check-linear' },
};

export const FAQS: readonly FaqItem[] = [
  {
    question: 'Berapa estimasi biaya jasa konstruksi dan renovasi rumah di Malang?',
    answer:
      'Biaya konstruksi dan renovasi di Bina Project dihitung secara transparan melalui Rencana Anggaran Biaya (RAB) terperinci sesuai spesifikasi material, luas bangunan, dan tingkat kompleksitas desain. Kami menyediakan opsi fleksibel mulai dari paket hemat, standar, hingga premium.',
    category: 'biaya',
  },
  {
    question: 'Apakah survei lokasi lahan dan konsultasi desain awal dikenakan biaya?',
    answer:
      'Tidak! Survei fisik lokasi lahan dan konsultasi awal untuk wilayah Kota Malang, Kota Batu, dan sekitarnya 100% GRATIS tanpa ikatan komitmen bersama arsitek kami.',
    category: 'biaya',
  },
  {
    question: 'Berapa lama estimasi pengerjaan custom kitchen set dan desain interior?',
    answer:
      'Tahap perancangan 3D visual biasanya memerlukan 3-7 hari kerja. Setelah desain disepakati, proses fabrikasi di workshop membutuhkan waktu 2-4 minggu tergantung dimensi dan pilihan material finishing (HPL/Duco/Solid Surface).',
    category: 'proses',
  },
  {
    question: 'Apakah seluruh pekerjaan konstruksi dan interior memiliki garansi resmi?',
    answer:
      'Ya, Bina Project memberikan jaminan garansi pemeliharaan pasca-konstruksi untuk kebocoran atap/dak beton (waterproofing), kekokohan struktur, hingga fungsionalitas hardware dan engsel interior.',
    category: 'garansi',
  },
  {
    question: 'Wilayah mana saja yang dicakup oleh layanan Bina Project?',
    answer:
      'Kantor pusat dan workshop kami berada di Kota Malang. Kami melayani pengerjaan proyek konstruksi dan interior di Kota Malang, Kota Batu, Kabupaten Malang, Pasuruan, dan Surabaya-Sidoarjo dengan tim dan armada mandiri.',
    category: 'proses',
  },
  {
    question: 'Apakah ada paket hemat untuk renovasi rumah kecil di bawah 100 m2?',
    answer:
      'Ya, kami menyediakan quotation fleksibel untuk renovasi parsial. Untuk rumah di bawah 100 m2, kami dapat fokus pada area prioritas seperti fasad, kitchen set, atau kamar mandi dengan budget yang disesuaikan. Hubungi +62 81-335-335-304 untuk konsultasi gratis dan perhitungan RAB custom.',
    category: 'biaya',
  },
  {
    question: 'Berapa DP minimal untuk mulai proyek konstruksi?',
    answer:
      'DP (Down Payment) awal biasanya 20-30% dari nilai kontrak untuk mobilisasi material dan persiapan site. Sisanya dibayar bertahap sesuai progres fisik (termin fondasi, struktur, finishing). Detail skema pembayaran tertuang jelas dalam SPK (Surat Perjanjian Kerja).',
    category: 'biaya',
  },
  {
    question: 'Apakah bisa cicil pembayaran per tahap dengan sistem termin?',
    answer:
      'Sangat bisa. Pembayaran proyek Bina Project menggunakan sistem termin berdasarkan pencapaian progres fisik riil, misalnya Termin 1 (fondasi selesai), Termin 2 (struktur kolom dan balok), Termin 3 (dinding dan atap), Termin 4 (finishing), dan Retensi (garansi). Klien hanya membayar setelah progres terverifikasi.',
    category: 'biaya',
  },
  {
    question: 'Berapa biaya kitchen set 3 meter untuk finishing HPL standar?',
    answer:
      'Biaya kitchen set dihitung per meter lari tergantung spesifikasi: jenis HPL, hardware (engsel biasa atau slow-motion), top table (granit atau solid surface), dan kompleksitas desain. Untuk kitchen set 3 meter dengan HPL standar, hubungi +62 81-335-335-304 untuk quote detail sesuai kebutuhan Anda.',
    category: 'biaya',
  },
  {
    question: 'Apakah harga RAB sudah termasuk PPN 11%?',
    answer:
      'Harga dalam RAB umumnya belum termasuk PPN. PPN 11% dikenakan jika klien membutuhkan faktur pajak resmi untuk klaim pajak perusahaan atau instansi. Untuk klien perorangan rumah tinggal yang tidak membutuhkan faktur pajak, biaya dihitung tanpa PPN. Detail ini dijelaskan saat pemaparan RAB.',
    category: 'biaya',
  },
  {
    question: 'Apa perbedaan bata ringan (hebel) dan bata merah untuk dinding?',
    answer:
      'Bata ringan (hebel) lebih ringan, presisi ukuran, pemasangan lebih cepat, dan insulasi panas lebih baik sehingga cocok untuk iklim Malang. Bata merah lebih kuat untuk dinding penahan beban berat tetapi lebih berat dan lebih lama pemasangannya. Bina Project umumnya menggunakan bata ringan untuk efisiensi dan kualitas.',
    category: 'material',
  },
  {
    question: 'Apakah kitchen set Bina Project anti rayap dan tahan lembab?',
    answer:
      'Ya. Kami menggunakan material blockboard atau multiplek yang sudah treatment anti rayap. Untuk area rawan lembab seperti bawah sink dan dekat kompor, kami lapisi dengan coating waterproof dan backing HPL waterproof. Hardware seperti engsel dan rel juga anti karat (stainless steel).',
    category: 'material',
  },
  {
    question: 'Jenis waterproofing mana yang cocok untuk dak beton ekspos?',
    answer:
      'Untuk dak beton ekspos tanpa penutup genteng, kami merekomendasikan waterproofing membran bakar elastis bertulang polyester atau coating cementitious 2 komponen. Keduanya tahan sinar UV dan elastis mengikuti pergerakan beton. Tim kami akan survei kondisi dak dan merekomendasikan solusi terbaik dengan garansi 3-5 tahun.',
    category: 'material',
  },
  {
    question: 'Apakah rangka atap menggunakan baja ringan atau kayu?',
    answer:
      'Bina Project menggunakan rangka atap baja ringan galvalum tebal 0.75mm-1.00mm. Baja ringan lebih tahan rayap, tidak lapuk, lebih ringan sehingga mengurangi beban struktur, dan pemasangan lebih presisi dibanding kayu. Untuk proyek heritage yang membutuhkan kayu, kami dapat menyediakan kayu meranti kelas A.',
    category: 'material',
  },
  {
    question: 'Berapa lama waktu pengerjaan renovasi fasad rumah?',
    answer:
      'Renovasi fasad tanpa merombak struktur utama biasanya memerlukan waktu 3-6 minggu tergantung luas fasad dan kompleksitas desain seperti roster bata, cladding kayu, atau panel ACP. Tahapannya meliputi pembongkaran finish lama, perbaikan plester, aplikasi finishing baru, dan detailing aksen.',
    category: 'proses',
  },
  {
    question: 'Apakah bisa mempercepat jadwal konstruksi dengan menambah tenaga kerja?',
    answer:
      'Bisa, dengan catatan penambahan tukang hanya efektif untuk pekerjaan yang dapat dikerjakan paralel, misalnya tim A memasang dinding sementara tim B memasang rangka atap. Untuk pekerjaan sekuensial seperti fondasi ke struktur ke finishing, penambahan tenaga tidak mempercepat karena harus menunggu tahap sebelumnya selesai.',
    category: 'proses',
  },
  {
    question: 'Kapan waktu terbaik mulai membangun rumah, musim kemarau atau hujan?',
    answer:
      'Idealnya mulai di awal musim kemarau (April-Mei) agar tahap pengecoran fondasi dan struktur tidak terganggu hujan. Jika harus mulai saat musim hujan, pembangunan tetap dapat dilakukan dengan proteksi terpal dan penjadwalan pengecoran saat cuaca cerah. Tim kami memantau prakiraan cuaca untuk timing pengecoran yang optimal.',
    category: 'proses',
  },
  {
    question: 'Garansi waterproofing berapa tahun?',
    answer:
      'Garansi waterproofing Bina Project untuk dak beton dan talang adalah 3 tahun untuk sistem coating cementitious dan 5 tahun untuk membran bakar elastis, dengan syarat tidak ada modifikasi struktur beton setelah aplikasi. Garansi mencakup service gratis jika terjadi kebocoran akibat aplikasi.',
    category: 'garansi',
  },
  {
    question: 'Apakah ada garansi engsel dan rel laci kitchen set?',
    answer:
      'Ya, engsel slow-motion dan rel laci tandem kami garansi 1 tahun untuk fungsi mekanis agar soft-closing tetap berfungsi. Jika ada kerusakan akibat pemakaian normal (bukan penyalahgunaan), kami ganti gratis. Body kabinet HPL sendiri tahan hingga 10-15 tahun.',
    category: 'garansi',
  },
  {
    question: 'Bagaimana prosedur klaim garansi jika ada kebocoran setelah serah terima?',
    answer:
      'Hubungi +62 81-335-335-304 via WhatsApp dengan foto atau video dokumentasi kebocoran. Tim kami akan menjadwalkan inspeksi ke lokasi dalam 1-3 hari kerja. Jika terverifikasi kebocoran akibat aplikasi waterproofing, kami lakukan perbaikan gratis sesuai garansi tertulis di SPK dalam 3-7 hari kerja.',
    category: 'garansi',
  },
] as const;

export const FAQS_EN: readonly FaqItem[] = [
  {
    question: 'What is the estimated cost of home construction and renovation services in Malang?',
    answer:
      'Construction and renovation costs at Bina Project are calculated transparently through an itemized Bill of Quantities (BOQ/RAB) according to material specifications, building area, and architectural complexity. We provide flexible options ranging from budget-efficient, standard, to premium packages.',
    category: 'biaya',
  },
  {
    question: 'Is there any fee for on-site land survey and initial design consultation?',
    answer:
      'No! Physical site surveys and initial consultations across Malang City, Batu, and surrounding areas are 100% FREE with zero commitment alongside our architects.',
    category: 'biaya',
  },
  {
    question: 'How long does custom kitchen set and interior design fabrication take?',
    answer:
      'The 3D visualization design stage typically takes 3-7 business days. Once approved, fabrication in our workshop takes 2-4 weeks depending on dimensions and finishing materials (HPL/Duco/Solid Surface).',
    category: 'proses',
  },
  {
    question: 'Do all construction and interior works come with an official warranty?',
    answer:
      'Yes, Bina Project provides a written post-handover maintenance warranty covering roof/concrete deck waterproofing leaks, structural integrity, and interior hardware/hinges functionality.',
    category: 'garansi',
  },
  {
    question: 'Which service areas does Bina Project cover?',
    answer:
      'Our studio and workshop are based in Malang City. We serve construction and interior projects across Malang City, Batu City, Malang Regency, Pasuruan, and Surabaya-Sidoarjo with our own dedicated in-house teams.',
    category: 'proses',
  },
  {
    question: 'Is there a budget package for small home renovations under 100 m2?',
    answer:
      'Yes, we offer flexible quotations for partial renovations. For homes under 100 m2, we can prioritize focal areas such as the facade, kitchen set, or bathrooms tailored to your budget. Contact +62 81-335-335-304 for a free consultation and custom BOQ calculation.',
    category: 'biaya',
  },
  {
    question: 'What is the minimum down payment (DP) to initiate a construction project?',
    answer:
      'The initial Down Payment is typically 20-30% of the contract value for material mobilization and site preparation. The remaining balance is paid in stages tied to verified physical milestones (foundation, structure, finishing). All payment terms are clearly stated in the official Work Agreement (SPK).',
    category: 'biaya',
  },
  {
    question: 'Can payments be made in stages through a milestone-based installment system?',
    answer:
      'Absolutely. Bina Project uses a milestone payment system based on verified physical progress: Milestone 1 (completed foundation), Milestone 2 (structural columns and beams), Milestone 3 (walls and roofing), Milestone 4 (finishing), and Retention (warranty). Clients only disburse funds after progress is physically verified.',
    category: 'biaya',
  },
  {
    question: 'What is the cost of a 3-meter kitchen set with standard HPL finish?',
    answer:
      'Kitchen set costs are calculated per linear meter depending on specifications: HPL grade, hardware (standard or soft-closing hinges), countertop (granite or solid surface), and design complexity. For a 3-meter setup with standard HPL, contact +62 81-335-335-304 for a detailed quote tailored to your space.',
    category: 'biaya',
  },
  {
    question: 'Does the itemized BOQ/RAB price include 11% VAT (PPN)?',
    answer:
      'BOQ quotations generally exclude VAT. An 11% VAT applies if the client requires an official tax invoice (faktur pajak) for corporate accounting. For individual residential clients who do not require tax invoices, costs are calculated net without VAT. This is explained during the initial BOQ presentation.',
    category: 'biaya',
  },
  {
    question: 'What is the difference between AAC lightweight blocks (hebel) and red clay bricks for walls?',
    answer:
      'AAC lightweight blocks (hebel) are lighter, dimensionally precise, quicker to install, and provide superior thermal insulation ideal for the local climate. Red clay bricks offer high load-bearing strength but add weight and require longer installation times. Bina Project typically utilizes AAC blocks for optimal structural efficiency and quality.',
    category: 'material',
  },
  {
    question: 'Are Bina Project kitchen sets termite-proof and moisture-resistant?',
    answer:
      'Yes. We use premium blockboard or marine-grade plywood treated with anti-termite sealant. For moisture-prone areas around the sink and cooktop, we apply waterproof coating and waterproof HPL backing. All hardware including hinges and drawer runners are rust-resistant stainless steel.',
    category: 'material',
  },
  {
    question: 'Which waterproofing system is best suited for exposed flat concrete decks?',
    answer:
      'For exposed concrete decks without tile roofing, we recommend polyester-reinforced elastomeric torch-on membrane or two-component cementitious waterproofing coatings. Both resist UV degradation and flex with concrete thermal expansion. Our team surveys the deck and provides the optimal solution with a 3-5 year warranty.',
    category: 'material',
  },
  {
    question: 'Do you use light-gauge steel trusses or timber for roof framing?',
    answer:
      'Bina Project standardly uses 0.75mm-1.00mm galvalume light-gauge steel trusses. Light-gauge steel is termite-proof, rot-free, lightweight to reduce structural load, and dimensionally accurate compared to timber. For heritage projects requiring exposed wood, we can provide Grade-A Meranti or teak timber.',
    category: 'material',
  },
  {
    question: 'How long does a residential facade renovation typically take?',
    answer:
      'A facade redesign without altering the primary structural frame generally takes 3-6 weeks depending on surface area and architectural complexity, such as decorative breeze blocks (roster), timber cladding, or ACP panels. Stages include stripping old finishes, plaster leveling, new cladding application, and accent detailing.',
    category: 'proses',
  },
  {
    question: 'Can the construction timeline be expedited by adding more workers?',
    answer:
      'Yes, provided the additional workforce is assigned to parallel trades (e.g., Team A laying masonry while Team B installs roof trusses). For sequential tasks such as curing concrete foundations to column casting, adding manpower cannot bypass necessary material curing times.',
    category: 'proses',
  },
  {
    question: 'When is the best time to start home construction, dry season or rainy season?',
    answer:
      'Ideally start at the onset of the dry season (April-May) so foundational excavation and structural casting proceed uninterrupted by rain. If commencing during rainy months, work proceeds safely with protective tarpaulins and scheduled casting during dry windows.',
    category: 'proses',
  },
  {
    question: 'How many years does the waterproofing warranty last?',
    answer:
      'Bina Project\'s waterproofing warranty covers 3 years for cementitious coating systems and 5 years for elastomeric torch-on membrane, provided no post-application structural alterations occur. The warranty includes complimentary repair service should any leakage occur.',
    category: 'garansi',
  },
  {
    question: 'Is there a warranty on kitchen set hinges and drawer runners?',
    answer:
      'Yes, soft-closing hinges and tandem drawer slides include a 1-year warranty on mechanical performance. Any defect under normal residential usage is replaced free of charge. The HPL cabinet carcasses themselves have an expected lifespan of 10-15 years.',
    category: 'garansi',
  },
  {
    question: 'What is the warranty claim procedure if a leak occurs after handover?',
    answer:
      'Contact +62 81-335-335-304 on WhatsApp with photos or video logs of the issue. Our engineering team schedules an on-site inspection within 1-3 business days. Verified application defects are rectified free of charge in accordance with the SPK warranty within 3-7 business days.',
    category: 'garansi',
  },
] as const;

export function getFaqs(lang: 'id' | 'en' = 'id'): readonly FaqItem[] {
  return lang === 'en' ? FAQS_EN : FAQS;
}

/**
 * Generate Schema.org FAQPage JSON-LD data
 */
export function generateFaqSchema(faqList: readonly FaqItem[] = FAQS) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
