import { uploadToStorage } from '../services/upload.service.js';
import { httpError } from '../middleware/errorHandler.js';

/** POST /api/upload  [Admin] */
export async function uploadImage(req, res, next) {
  try {
    if (!req.file) throw httpError(400, 'Tidak ada file yang diunggah.');

    const { url, path } = await uploadToStorage(req.file);
    res.status(201).json({ url, path });
  } catch (err) {
    next(err);
  }
}
