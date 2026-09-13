/**
 * @file articles.ts
 * @description Single Source of Truth for blog articles and interior inspiration articles.
 */

import type { Article } from '@types';

export const ARTICLES: readonly Article[] = [
  {
    slug: '5-tren-desain-interior',
    title: '5 Tren Desain Interior yang Bikin Rumahmu Makin Kece di 2024!',
    author: 'Bina Project',
    publish_date: '20 Januari 2024',
    category: 'Interior',
    excerpt:
      'Dunia desain interior selalu berputar, menghadirkan inovasi dan estetika baru setiap tahunnya. Berikut 5 tren utama yang wajib kamu ketahui.',
    cover_image: 'assets/img/blog/1.jpg',
    content: `
      <p>Dunia desain interior selalu berputar, menghadirkan inovasi dan estetika baru setiap tahunnya. Di tahun 2024 ini, tren interior semakin menekankan pada keharmonisan antara kenyamanan fungsional dan keindahan visual alami.</p>
      
      <h2>1. Konsep Biophilic Design (Sentuhan Alami)</h2>
      <p>Membawa elemen alam ke dalam ruangan menjadi primadona. Penggunaan tanaman indoor berdaun lebar, pencahayaan alami maksimal melalui jendela besar, serta material kayu alami dengan serat terbuka memberikan ketenangan pikiran bagi penghuni.</p>
      
      <h2>2. Warna-warna Earth Tone dan Hangat</h2>
      <p>Warna abu-abu monokrom yang kaku mulai digantikan oleh palet hangat seperti terracotta, beige, sage green, dan warm sand. Warna ini menciptakan atmosfer yang mengundang dan homey.</p>
      
      <h2>3. Furnitur Multifungsi & Smart Storage</h2>
      <p>Efisiensi ruang menjadi kunci hunian modern. Custom furniture seperti dipan dengan laci rahasia, meja makan lipat, dan kitchen set terintegrasi semakin diminati keluarga muda.</p>
      
      <h2>4. Tekstur Kaya dan Permainan Material</h2>
      <p>Kombinasi marmer matte, rotan halus, aksen kuningan, dan kain bouclé menghadirkan kedalaman visual tanpa perlu banyak dekorasi berlebihan.</p>
      
      <h2>5. Pencahayaan Berlapis (Layered Lighting)</h2>
      <p>Tidak lagi mengandalkan satu lampu utama di tengah ruangan. Penggunaan hidden LED strip, lampu gantung aksen, dan floor lamp sudut menciptakan mood ruangan yang fleksibel sesuai kebutuhan waktu.</p>
    `,
  },
  {
    slug: 'evolusi-sentuhan',
    title: 'Evolusi Sentuhan Interior: Dari Klasik hingga Kontemporer',
    author: 'Bina Project',
    publish_date: '15 Februari 2024',
    category: 'Arsitektur',
    excerpt:
      'Memahami bagaimana pergeseran gaya desain mempengaruhi kenyamanan dan nilai investasi properti Anda.',
    cover_image: 'assets/img/blog/2.jpg',
    content: `
      <p>Desain arsitektur dan interior bangunan selalu merefleksikan gaya hidup dan kemajuan teknologi pada zamannya. Dari ornamen klasik yang megah hingga garis tegas minimalis modern, setiap gaya memiliki keunikan tersendiri.</p>
      
      <h2>Keseimbangan Antara Estetika dan Fungsi</h2>
      <p>Gaya kontemporer saat ini tidak hanya mementingkan tampilan bersih, tetapi juga durabilitas material dan kemudahan perawatan harian. Dengan pemilihan material berkualitas tinggi seperti HPL premium, solid surface, dan rangka baja ringan berlapis anti-karat, bangunan tidak hanya indah saat baru selesai, namun tetap prima hingga puluhan tahun mendatang.</p>
      
      <h2>Pentingnya Perencanaan Arsitektur yang Matang</h2>
      <p>Bina Project senantiasa mengutamakan konsultasi mendalam bersama klien untuk menerjemahkan karakter dan kebutuhan personal ke dalam rancangan denah dan 3D visual yang presisi sebelum tahap konstruksi dimulai.</p>
    `,
  },
  {
    slug: 'trik-desain-kitchen-set',
    title: 'Trik Desain Kitchen Set untuk Dapur Minimalis agar Tetap Lega',
    author: 'Bina Project',
    publish_date: '02 Maret 2024',
    category: 'Kitchen Set',
    excerpt:
      'Dapur sempit bukan halangan untuk memasak dengan nyaman. Simak tips memaksimalkan tata letak kitchen set berikut.',
    cover_image: 'assets/img/blog/3.jpg',
    content: `
      <p>Dapur sering disebut sebagai jantung dari sebuah rumah. Namun pada rumah berukuran compact, menata dapur seringkali menjadi tantangan tersendiri. Berikut beberapa trik dari tim desainer Bina Project:</p>
      
      <h2>1. Manfaatkan Kabinet Vertikal Hingga Plafon</h2>
      <p>Membuat kabinet atas full hingga menyentuh plafon tidak hanya menambah kapasitas penyimpanan, tetapi juga mencegah debu dan minyak menumpuk di atas lemari.</p>
      
      <h2>2. Terapkan Prinsip 'Work Triangle'</h2>
      <p>Pastikan alur segitiga kerja antara kulkas (penyimpanan), sink (pencucian), dan kompor (memasak) tidak terhalang agar aktivitas memasak berjalan efisien.</p>
      
      <h2>3. Pemilihan Material Table Top yang Tahan Panas & Gores</h2>
      <p>Gunakan material solid surface, granit, atau sintered stone berkualitas tinggi agar tahan terhadap panas panci, goresan pisau, serta mudah dibersihkan dari tumpahan bumbu dapur.</p>
    `,
  },
  {
    slug: 'wujudkan-ruang-impian-anda',
    title: 'Wujudkan Ruang Impian Anda Bersama Bina Project',
    author: 'Bina Project',
    publish_date: '10 April 2024',
    category: 'Konstruksi',
    excerpt:
      'Langkah-langkah praktis dan transparan dari tahap konsultasi desain, estimasi RAB, hingga serah terima kunci.',
    cover_image: 'assets/img/blog/4.jpg',
    content: `
      <p>Membangun atau merenovasi rumah adalah salah satu keputusan investasi terbesar dalam hidup. Oleh karena itu, memilih partner kontraktor yang jujur, transparan, dan berpengalaman adalah langkah krusial.</p>
      
      <h2>Alur Kerja Profesional Bina Project</h2>
      <ol>
        <li><strong>Konsultasi & Survey Lokasi:</strong> Mendengarkan kebutuhan Anda dan mengukur fisik lahan secara akurat.</li>
        <li><strong>Desain 2D & 3D Visual:</strong> Memberikan gambaran nyata sebelum satu bata pun dipasang.</li>
        <li><strong>Rencana Anggaran Biaya (RAB) Transparan:</strong> Tanpa biaya tersembunyi, spesifikasi material jelas tertulis dalam kontrak kerja.</li>
        <li><strong>Pelaksanaan & Pengawasan Berkala:</strong> Laporan progress rutin via foto dan video kepada Anda.</li>
        <li><strong>Serah Terima & Garansi Pemeliharaan:</strong> Jaminan kualitas hasil pekerjaan demi ketenangan Anda.</li>
      </ol>
    `,
  },
] as const;
