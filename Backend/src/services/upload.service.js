import { supabase } from '../config/supabase.js';
import { httpError } from '../middleware/errorHandler.js';
import { env } from '../config/env.js';

/**
 * Upload buffer file ke Supabase Storage dan kembalikan URL publik.
 * @param {{ buffer: Buffer, mimetype: string, originalname: string }} file - File dari multer
 * @returns {{ url: string, path: string }}
 */
export async function uploadToStorage(file) {
  const ext = file.originalname.split('.').pop().toLowerCase();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(env.STORAGE_BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) throw httpError(500, `Gagal upload foto: ${uploadError.message}`);

  const { data } = supabase.storage.from(env.STORAGE_BUCKET).getPublicUrl(filePath);
  return { url: data.publicUrl, path: filePath };
}

/**
 * Hapus file dari Supabase Storage berdasarkan path.
 * @param {string} filePath - Path file di dalam bucket
 */
export async function deleteFromStorage(filePath) {
  const { error } = await supabase.storage.from(env.STORAGE_BUCKET).remove([filePath]);
  if (error) console.error(`[storage] Gagal hapus file ${filePath}: ${error.message}`);
}
