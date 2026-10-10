import { z } from 'zod';

export const productSchema = z.object({
  category_id: z.number().int().positive().nullable().optional(),
  name: z.string().min(2, 'Nama produk minimal 2 karakter.'),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung.'),
  description: z.string().optional(),
  price: z.number().int().min(0, 'Harga tidak boleh negatif.'),
  stock: z.number().int().min(0, 'Stok tidak boleh negatif.'),
  images: z.array(z.string().url()).default([]),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

// Semua field opsional saat update
export const productUpdateSchema = productSchema.partial();
