export interface FallbackLiveProject {
  id: string;
  title: string;
  area_name: string;
  category: 'Konstruksi' | 'Interior' | 'Desain';
  stage: string;
  progress: number;
  lat: number;
  lng: number;
  image_url: string;
  is_active: boolean;
}

export const FALLBACK_LIVE_PROJECTS: FallbackLiveProject[] = [
  {
    id: 'sample-1',
    title: 'Pembangunan Rumah Tinggal Modern 2 Lantai',
    area_name: 'Araya, Kota Malang',
    category: 'Konstruksi',
    stage: 'Pengecoran Plat Lantai 2 & Struktur Kolom',
    progress: 65,
    lat: -7.935,
    lng: 112.658,
    image_url: 'https://images.unsplash.com/photo-1590381105924-c759b3f3e8a9?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
  {
    id: 'sample-2',
    title: 'Fabrikasi & Instalasi Kitchen Set Minimalis',
    area_name: 'Klojen, Kota Malang',
    category: 'Interior',
    stage: 'Finishing Duco & Fitting Hardware Slow-Motion',
    progress: 90,
    lat: -7.978,
    lng: 112.63,
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
  {
    id: 'sample-3',
    title: 'Konsep Arsitektur Villa Tropis Modern',
    area_name: 'Kedungkandang, Kota Malang',
    category: 'Desain',
    stage: 'Penyusunan Gambar Arsitektur & 3D Visualisasi',
    progress: 75,
    lat: -7.982,
    lng: 112.625,
    image_url: 'https://images.unsplash.com/photo-1600607686527-6f88c0a5dc1d?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
  {
    id: 'sample-4',
    title: 'Masterplan Kawasan Perumahan Eco-Green',
    area_name: 'Singosari, Kabupaten Malang',
    category: 'Desain',
    stage: 'Perencanaan Masterplan & Siteplan Detail',
    progress: 60,
    lat: -7.915,
    lng: 112.735,
    image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
];
