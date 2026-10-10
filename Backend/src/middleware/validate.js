import { ZodError } from 'zod';

/**
 * Higher-order middleware: Validasi request.body menggunakan skema Zod.
 *
 * Contoh pemakaian di route:
 *   import { validate } from '../middleware/validate.js';
 *   import { createProductSchema } from '../validators/product.validator.js';
 *
 *   router.post('/', requireAdmin, validate(createProductSchema), createProduct);
 *
 * @param {import('zod').ZodSchema} schema - Skema Zod untuk divalidasi
 * @param {'body' | 'query' | 'params'} source - Sumber data yang divalidasi (default: 'body')
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      // Ambil pesan error pertama dari Zod dan sertakan semua detail
      const errors = result.error.flatten().fieldErrors;
      const firstMessage = Object.values(errors).flat()[0] || 'Data tidak valid.';

      return res.status(400).json({
        message: firstMessage,
        errors,
      });
    }

    // Ganti req[source] dengan data yang sudah diparse & di-sanitasi Zod
    req[source] = result.data;
    next();
  };
}
