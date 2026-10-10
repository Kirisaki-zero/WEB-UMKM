import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

// Simpan file di memory (buffer), bukan di disk — lalu langsung upload ke Supabase
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // maks 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Hanya file JPG, PNG, atau WebP yang diizinkan.'));
    }
    cb(null, true);
  },
});

const router = Router();

// ── Admin ─────────────────────────────────────────────────────────────────────
// POST /api/upload  → field name: "image"
router.post('/', requireAdmin, upload.single('image'), uploadImage);

export default router;
