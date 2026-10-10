import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { validate } from '../middleware/validate.js';
import { settingsSchema } from '../validators/settings.validator.js';

const router = Router();

// ── Publik ────────────────────────────────────────────────────────────────────
router.get('/', getSettings); // GET /api/settings

// ── Admin ─────────────────────────────────────────────────────────────────────
router.put('/', requireAdmin, validate(settingsSchema), updateSettings); // PUT /api/settings

export default router;
