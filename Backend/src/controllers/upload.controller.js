import { supabase } from '../config/supabase.js';
import { env } from '../config/env.js';
import { httpError } from '../middleware/errorHandler.js';
import { extname } from 'path';

/** POST /api/upload  [Admin] */
export async function uploadImage(req, res, next) {
  try {
    if (!req.file) throw httpError(400, 'Tidak ada file yang diunggah.');

    const ext = extname(req.file.originalname).toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(env.STORAGE_BUCKET)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) throw httpError(500, uploadError.message);

    // Ambil URL publik
    const { data } = supabase.storage
      .from(env.STORAGE_BUCKET)
      .getPublicUrl(filePath);

    res.status(201).json({ url: data.publicUrl, path: filePath });
  } catch (err) {
    next(err);
  }
}
