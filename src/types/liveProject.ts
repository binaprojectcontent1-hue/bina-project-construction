export interface LiveProject {
  id: string;
  title: string;
  area_name: string;
  category: 'Konstruksi' | 'Renovasi' | 'Interior' | 'Arsitektur';
  stage: string;
  progress: number;
  lat: number;
  lng: number;
  image_url?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
