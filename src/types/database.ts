export type PublishStatus = 'published' | 'draft';

export interface Project {
  id?: string;
  slug: string;
  title: string;
  category: 'Eksterior' | 'Interior' | 'Konstruksi' | 'Kitchen Set' | string;
  location: string;
  project_date: string;
  client?: string;
  description: string;
  cover_image: string;
  gallery_images: string[];
  featured?: boolean;
  // Transformation Before-After Fields
  enable_before_after?: boolean;
  before_image?: string;
  after_image?: string;
  renovation_duration?: string;
  transformation_scope?: string;
  // Google SEO Fields & Publishing Status
  meta_title?: string;
  meta_description?: string;
  alt_cover_image?: string;
  og_image_type?: 'branded' | 'raw_cover';
  status?: PublishStatus;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Article {
  id?: string;
  slug: string;
  title: string;
  author: string;
  publish_date: string;
  category: string;
  excerpt: string;
  content: string;
  cover_image: string;
  // Google SEO Fields & Publishing Status
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  alt_cover_image?: string;
  og_image_type?: 'branded' | 'raw_cover';
  status?: PublishStatus;
  reading_time?: number;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Redirect {
  id?: string;
  source_path: string;
  target_path: string;
  status_code: number;
  created_at?: string;
  updated_at?: string;
}

export interface Lead {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  service?: string;
  message?: string;
  source_url?: string;
  status?: 'new' | 'contacted' | 'survey_scheduled' | 'deal' | 'lost';
  created_at?: string;
}

