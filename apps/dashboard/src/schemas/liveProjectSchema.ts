import { z } from 'zod';

export const liveProjectFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Nama proyek minimal 5 karakter.')
    .max(120, 'Nama proyek maksimal 120 karakter.'),
  area_name: z
    .string()
    .trim()
    .min(3, 'Nama kawasan minimal 3 karakter (contoh: Araya, Kota Malang).')
    .max(100, 'Nama kawasan maksimal 100 karakter.'),
  category: z.enum(['Konstruksi', 'Renovasi', 'Interior', 'Arsitektur']),
  stage: z
    .string()
    .trim()
    .min(3, 'Tahap pengerjaan wajib diisi (contoh: Pengecoran Plat Lantai 2).')
    .max(100, 'Tahap pengerjaan maksimal 100 karakter.'),
  progress: z
    .number()
    .int()
    .min(0, 'Progres minimal 0%.')
    .max(100, 'Progres maksimal 100%.'),
  lat: z.number(),
  lng: z.number(),
  image_url: z.string().trim().url('URL gambar tidak valid.').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

export type LiveProjectFormData = z.infer<typeof liveProjectFormSchema>;
