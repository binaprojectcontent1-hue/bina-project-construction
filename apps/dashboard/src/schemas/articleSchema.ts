import { z } from 'zod';

export const articleFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Judul artikel wajib diisi minimal 5 karakter.')
    .max(150, 'Judul artikel maksimal 150 karakter.'),
  slug: z
    .string()
    .trim()
    .min(3, 'Alamat link wajib diisi minimal 3 karakter.')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Format alamat link tidak valid. Gunakan huruf kecil, angka, dan tanda hubung (-) saja.'
    ),
  category: z.string().trim().min(1, 'Kategori wajib dipilih.'),
  excerpt: z
    .string()
    .trim()
    .max(300, 'Ringkasan artikel maksimal 300 karakter.')
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .trim()
    .min(10, 'Isi naskah artikel wajib diisi minimal 10 karakter.'),
  cover_image: z
    .string()
    .trim()
    .min(1, 'Foto sampul utama wajib diunggah atau dipilih.'),
  alt_cover_image: z
    .string()
    .trim()
    .min(1, 'Deskripsi foto sampul wajib diisi agar foto mudah ditemukan di pencarian Google.'),
  meta_title: z
    .string()
    .trim()
    .max(70, 'Judul tampilan Google disarankan maksimal 70 karakter.')
    .optional()
    .or(z.literal('')),
  meta_description: z
    .string()
    .trim()
    .max(160, 'Ringkasan tampilan Google disarankan maksimal 160 karakter.')
    .optional()
    .or(z.literal('')),
  focus_keyword: z.string().trim().optional().or(z.literal('')),
  author: z.string().trim().optional().or(z.literal('')),
  og_image_type: z.enum(['branded', 'raw_cover']).default('branded').optional(),
  is_published: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

export type ArticleFormData = z.infer<typeof articleFormSchema>;
