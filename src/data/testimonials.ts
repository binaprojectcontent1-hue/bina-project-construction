/**
 * @file testimonials.ts
 * @description Single Source of Truth for verified client reviews and testimonials.
 */

import type { TestimonialItem } from '@types';

export const TESTIMONIALS: readonly TestimonialItem[] = [
  {
    name: 'Rayung',
    role: 'Womanpreneur',
    image: '/assets/img/testimonial/rayung.jpg',
    quote: 'Alhamdulillah hasil interior mushola kami bagus. Sesuai ekspektasi dan gambar. Pengerjaannya rapi dan tepat waktu!',
    rating: 5,
    project: 'Interior Mushola',
  },
  {
    name: 'Ahsanun Naseh',
    role: 'CEO Arkatama',
    image: '/assets/img/testimonial/naseh.jpg',
    quote: 'Desainnya bagus, langsung speechless saya lihatnya. Ga ada komentar selain sangat memuaskan dan profesional.',
    rating: 5,
    project: 'Desain Arsitektur & Interior',
  },
  {
    name: 'Mega Karunia',
    role: 'Kepala Yayasan Barokah Multazam',
    image: '/assets/img/testimonial/mega.jpg',
    quote: 'Pengerjaannya bagus banget dan cepat. Desain yang dibuat juga sesuai dengan keinginan. Penataan interior sangat rapi. Bintang 5 buat Bina Project!',
    rating: 5,
    project: 'Pembangunan & Interior Gedung',
  },
  {
    name: 'Nuri Indra',
    role: 'Owner RS. Permata Bunda',
    image: '/assets/img/testimonial/nuri.jpg',
    quote: 'Pemasangan sangat rapih dan juga cepat. Pelayanannya juga baik, sering diberi rekomendasi terbaik. Next pasti order lagi!',
    rating: 5,
    project: 'Renovasi Fasilitas Kesehatan',
  },
  {
    name: 'Agung Rahmadi',
    role: 'PT. HK (Persero)',
    image: '/assets/img/testimonial/agung.jpg',
    quote: 'Hasilnya top, tidak mengecewakan. Pernah ada catatan sedikit dan langsung diatasi dengan sangat cepat dan solutif.',
    rating: 5,
    project: 'Pekerjaan Konstruksi & Sipil',
  },
  {
    name: 'Farid',
    role: 'Bea Cukai Pasuruan',
    image: '/assets/img/testimonial/farid.jpg',
    quote: 'Hasil renovasinya sangat tidak mengecewakan, timnya profesional dan sangat mengerti seluk-beluk teknis interior & konstruksi.',
    rating: 5,
    project: 'Renovasi Gedung Kantor',
  },
] as const;
