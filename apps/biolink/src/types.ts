export interface BioLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
  click_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface BioLinkSettings {
  id: string;
  profile_name: string;
  tagline: string;
  avatar_url: string | null;
  updated_at?: string;
}
