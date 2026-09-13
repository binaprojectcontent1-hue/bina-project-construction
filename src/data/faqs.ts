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
