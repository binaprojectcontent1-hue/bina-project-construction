export interface FallbackLiveProject {
  id: string;
  title: string;
  area_name: string;
  category: 'Konstruksi' | 'Renovasi' | 'Interior' | 'Arsitektur';
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
    image_url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
  {
    id: 'sample-2',
    title: 'Renovasi Total Fasad & Interior Villa',
    area_name: 'Bumiaji, Kota Batu',
    category: 'Renovasi',
    stage: 'Pemasangan Finishing Plafon & Rangka Atap',
    progress: 80,
    lat: -7.85,
    lng: 112.535,
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
  {
    id: 'sample-3',
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
    id: 'sample-4',
    title: 'Pembangunan Ruko & Kantor Bisnis 3 Lantai',
    area_name: 'Warugunung, Surabaya Barat',
    category: 'Konstruksi',
    stage: 'Pekerjaan Struktur Bawah & Pondasi Footplate',
    progress: 35,
    lat: -7.34,
    lng: 112.69,
    image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    is_active: true,
  },
];
