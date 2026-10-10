import { z } from 'zod';

const orderItemSchema = z.object({
  product_id: z.number().int().positive('ID produk tidak valid.'),
  qty: z.number().int().min(1, 'Jumlah minimal 1.'),
});

export const orderSchema = z.object({
  customer_name: z.string().min(2, 'Nama minimal 2 karakter.'),
  customer_phone: z
    .string()
    .min(9, 'Nomor WhatsApp tidak valid.')
    .regex(/^[0-9+]+$/, 'Nomor WhatsApp hanya boleh berisi angka.'),
  delivery_method: z.enum(['pickup', 'delivery'], {
    errorMap: () => ({ message: 'Metode pengiriman harus "pickup" atau "delivery".' }),
  }),
  address: z.string().optional(),
  note: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Pesanan harus memiliki minimal 1 produk.'),
});

export const orderStatusSchema = z.object({
  status: z.enum(['baru', 'diproses', 'selesai', 'batal'], {
    errorMap: () => ({ message: 'Status pesanan tidak valid.' }),
  }),
});
