import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter.'),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung.'),
});
