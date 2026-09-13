/**
 * Input Validation Schemas using Zod
 * All user inputs must be validated before processing
 */

import { z } from 'zod';

// GitHub Storage Configuration Schema
export const githubConfigSchema = z.object({
  owner: z.string()
    .min(1, 'Owner username wajib diisi')
    .max(39, 'Username maksimal 39 karakter')
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/, 'Format username tidak valid'),
  
  repo: z.string()
    .min(1, 'Repository name wajib diisi')
    .max(100, 'Repository name maksimal 100 karakter')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Nama repository hanya boleh huruf, angka, underscore, dash'),
  
  branch: z.string()
    .min(1, 'Branch wajib diisi')
    .max(255, 'Branch name terlalu panjang')
    .regex(/^[\w/-]+$/, 'Format branch tidak valid')
    .default('main'),
  
  token: z.string()
    .min(1, 'GitHub Personal Access Token wajib diisi')
    .max(1000, 'Token terlalu panjang')
    .regex(/^(ghp_|gho_|ghu_|ghs_|ghr_|github_pat_)[a-zA-Z0-9_]{36,255}$/, 
      'Format GitHub token tidak valid (harus dimulai dengan ghp_, gho_, dll)')
});

// Cloudflare Deploy Hook Schema
export const cloudflareDeployHookSchema = z.object({
  url: z.string()
    .url('URL harus berformat valid')
    .min(1, 'Cloudflare Deploy Hook URL wajib diisi')
    .regex(/^https:\/\/api\.cloudflare\.com\/client\/v4\/pages\/webhooks\/deploy_hooks\/[a-f0-9]+$/i,
      'URL Deploy Hook tidak valid. Format harus dari Cloudflare dashboard.')
});

// Login Credentials Schema
export const loginCredentialsSchema = z.object({
  email: z.string()
    .email('Format email tidak valid')
    .max(255, 'Email terlalu panjang')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email tidak valid'),
  
  password: z.string()
    .min(8, 'Kata sandi minimal 8 karakter')
    .max(255, 'Kata sandi terlalu panjang')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/, 
      'Kata sandi harus mengandung huruf dan angka')
});

// Portfolio Item Schema
export const projectSchema = z.object({
  title: z.string()
    .min(3, 'Judul minimal 3 karakter')
    .max(255, 'Judul maksimal 255 karakter'),
  
  slug: z.string()
    .min(3, 'Slug minimal 3 karakter')
    .max(255, 'Slug maksimal 255 karakter')
    .regex(/^[a-z0-9\-]+$/, 'Slug hanya boleh lowercase letters, numbers, dan dashes'),
  
  category: z.string()
    .min(1, 'Kategori wajib dipilih')
    .max(100, 'Kategori terlalu panjang'),
  
  location: z.string()
    .min(3, 'Lokasi minimal 3 karakter')
    .max(255, 'Lokasi maksimal 255 karakter'),
  
  project_date: z.string()
    .min(1, 'Tanggal proyek wajib diisi')
    .max(100, 'Tanggal format tidak valid'),
  
  client: z.string()
    .max(255, 'Nama klien terlalu panjang')
    .optional(),
  
  description: z.string()
    .min(50, 'Deskripsi minimal 50 karakter')
    .max(5000, 'Deskripsi maksimal 5000 karakter'),
  
  cover_image: z.string()
    .url('Cover image harus URL valid')
    .min(1, 'Cover image wajib),'),
  
  gallery_images: z.array(z.string())
    .max(50, 'Maksimal 50 gambar dalam galeri')
    .optional()
    .default([]),
  
  featured: z.boolean().optional().default(false),
  
  status: z.enum(['published', 'draft']).default('published').optional(),
  
  meta_title: z.string()
    .max(70, 'Meta title maksimal 70 karakter')
    .optional(),
  
  meta_description: z.string()
    .max(160, 'Meta description maksimal 160 karakter')
    .optional(),
  
  alt_cover_image: z.string()
    .max(255, 'Alt text terlalu panjang')
    .optional()
});

// Article/Blog Schema
export const articleSchema = z.object({
  title: z.string()
    .min(3, 'Judul minimal 3 karakter')
    .max(255, 'Judul maksimal 255 karakter'),
  
  slug: z.string()
    .min(3, 'Slug minimal 3 karakter')
    .max(255, 'Slug maksimal 255 karakter')
    .regex(/^[a-z0-9\-]+$/, 'Slug hanya boleh lowercase letters, numbers, dan dashes'),
  
  author: z.string()
    .max(100, 'Penulis terlalu panjang')
    .default('Bina Project'),
  
  publish_date: z.string()
    .min(1, 'Tanggal terbit wajib diisi'),
  
  category: z.string()
    .max(100, 'Kategori terlalu panjang')
    .default('Interior'),
  
  excerpt: z.string()
    .min(50, 'Ekskripsi minimal 50 karakter')
    .max(500, 'Ekskripsi maksimal 500 karakter'),
  
  content: z.string()
    .min(100, 'Konten minimal 100 karakter')
    .max(50000, 'Konten terlalu panjang'),
  
  cover_image: z.string()
    .url('Cover image harus URL valid')
    .min(1, 'Cover image wajib'),
  
  focus_keyword: z.string()
    .max(100, 'Keyword terlalu panjang')
    .optional(),
  
  reading_time: z.number()
    .int()
    .min(1, 'Reading time minimal 1 menit')
    .max(60, 'Reading time maksimal 60 menit')
    .default(3),
  
  status: z.enum(['published', 'draft']).default('published').optional(),
  
  meta_title: z.string()
    .max(70, 'Meta title maksimal 70 karakter')
    .optional(),
  
  meta_description: z.string()
    .max(160, 'Meta description maksimal 160 karakter')
    .optional(),
  
  alt_cover_image: z.string()
    .max(255, 'Alt text terlalu panjang')
    .optional()
});

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z\s\u00C0-\u017F]+$/, 'Nama hanya boleh huruf dan spasi'),
  
  email: z.string()
    .email('Format email tidak valid')
    .max(255, 'Email terlalu panjang'),
  
  phone: z.string()
    .regex(/^\+?[0-9\s\-\(\)]+$/, 'Format nomor telepon tidak valid')
    .optional(),
  
  message: z.string()
    .min(10, 'Pesan minimal 10 karakter')
    .max(2000, 'Pesan maksimal 2000 karakter'),
  
  district: z.string()
    .max(100, 'Wilayah tidak valid')
    .optional()
});

// Redirect Schema
export const redirectSchema = z.object({
  source_path: z.string()
    .min(1, 'Source path wajib diisi')
    .max(255, 'Source path terlalu panjang')
    .regex(/^\/[a-zA-Z0-9\-\/]*$/, 'Source path harus dimulai dengan /'),
  
  target_path: z.string()
    .min(1, 'Target path wajib diisi')
    .max(255, 'Target path terlalu panjang')
    .regex(/^\/[a-zA-Z0-9\-\/]*$/, 'Target path harus dimulai dengan /'),
  
  status_code: z.number()
    .int()
    .min(300, 'Status code minimal 300')
    .max(399, 'Status code maksimal 399')
    .default(301)
});

// Utility function for validating inputs with proper error handling
export function validateInput<T extends z.ZodType<any>>(
  schema: T,
  data: unknown,
  context?: string
): { success: boolean; data?: z.infer<T>; error?: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error: any) {
    // Get first validation error message
    const errorMessage = error.errors?.[0]?.message || 'Validasi gagal';
    
    console.warn(`[${context || 'Validation'}] Invalid input: ${errorMessage}`);
    return { 
      success: false, 
      error: errorMessage 
    };
  }
}

// Export all schemas for reuse (commented out - not exported in types file)
// export type {
//   GithubConfig,
//   CloudflareDeployHook,
//   LoginCredentials,
//   Project,
//   Article,
//   ContactFormData,
//   Redirect
// } from './types';
