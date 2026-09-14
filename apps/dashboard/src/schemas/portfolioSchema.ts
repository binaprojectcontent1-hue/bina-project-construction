import { z } from 'zod';

export const portfolioFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Judul proyek portofolio wajib diisi minimal 5 karakter.')
    .max(150, 'Judul proyek maksimal 150 karakter.'),
  slug: z
    .string()
    .trim()
    .min(3, 'Slug URL wajib diisi minimal 3 karakter.')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Format slug tidak valid. Gunakan huruf kecil, angka, dan tanda hubung (-) saja.'
    ),
  category: z.string().trim().min(1, 'Kategori proyek wajib dipilih.'),
  location: z.string().trim().min(1, 'Lokasi proyek wajib diisi.'),
  projectDate: z.string().trim().min(1, 'Tahun/tanggal proyek wajib diisi.'),
  client: z.string().trim().optional().or(z.literal('')),
  description: z
    .string()
    .trim()
    .min(10, 'Deskripsi proyek wajib diisi minimal 10 karakter.'),
  coverImage: z
    .string()
    .trim()
    .min(1, 'Foto utama proyek (cover image) wajib dipilih.'),
  altCoverImage: z
    .string()
    .trim()
    .min(1, 'Alt text foto wajib diisi untuk Google Image SEO.'),
  galleryImages: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['published', 'draft']).default('published'),
  // Before-After Transformation Fields
  enable_before_after: z.boolean().default(false).optional(),
  before_image: z.string().trim().optional().or(z.literal('')),
  after_image: z.string().trim().optional().or(z.literal('')),
  renovation_duration: z.string().trim().optional().or(z.literal('')),
  transformation_scope: z.string().trim().optional().or(z.literal('')),
  metaTitle: z
    .string()
    .trim()
    .max(70, 'Meta Title Google disarankan di bawah 70 karakter.')
    .optional()
    .or(z.literal('')),
  metaDescription: z
    .string()
    .trim()
    .max(160, 'Meta Description Google disarankan di bawah 160 karakter.')
    .optional()
    .or(z.literal('')),
  og_image_type: z.enum(['branded', 'raw_cover']).default('branded').optional(),
});

export type PortfolioFormData = z.infer<typeof portfolioFormSchema>;
