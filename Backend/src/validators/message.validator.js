import { z } from 'zod';

export const messageSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter.'),
  contact: z.string().min(5, 'Kontak tidak valid (email atau nomor telepon).'),
  body: z.string().min(10, 'Pesan minimal 10 karakter.'),
});
