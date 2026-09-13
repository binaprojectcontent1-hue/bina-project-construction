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
    .min(3, 'Slug URL wajib diisi minimal 3 karakter.')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Format slug tidak valid. Gunakan huruf kecil, angka, dan tanda hubung (-) saja.'
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
    .min(1, 'Foto sampul (cover image) wajib diunggah atau dipilih.'),
  alt_cover_image: z
    .string()
    .trim()
    .min(1, 'Alt text cover wajib diisi untuk Google Image SEO.'),
  meta_title: z
    .string()
    .trim()
    .max(70, 'Meta Title Google disarankan di bawah 70 karakter.')
    .optional()
    .or(z.literal('')),
  meta_description: z
    .string()
    .trim()
    .max(160, 'Meta Description Google disarankan di bawah 160 karakter.')
    .optional()
    .or(z.literal('')),
  focus_keyword: z.string().trim().optional().or(z.literal('')),
  author: z.string().trim().optional().or(z.literal('')),
  is_published: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

export type ArticleFormData = z.infer<typeof articleFormSchema>;
