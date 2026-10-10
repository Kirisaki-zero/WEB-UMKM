import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categories.controller.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { validate } from '../middleware/validate.js';
import { categorySchema } from '../validators/category.validator.js';

const router = Router();

// ── Publik ────────────────────────────────────────────────────────────────────
router.get('/', getCategories);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.post('/', requireAdmin, validate(categorySchema), createCategory);
router.put('/:id', requireAdmin, validate(categorySchema), updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);

export default router;
