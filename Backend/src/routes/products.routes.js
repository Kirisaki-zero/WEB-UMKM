import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { validate } from '../middleware/validate.js';
import { productSchema, productUpdateSchema } from '../validators/product.validator.js';

const router = Router();

// ── Publik ────────────────────────────────────────────────────────────────────
router.get('/', getProducts);          // GET /api/products?category=&q=&page=&limit=
router.get('/:slug', getProductBySlug); // GET /api/products/:slug

// ── Admin ─────────────────────────────────────────────────────────────────────
router.post('/', requireAdmin, validate(productSchema), createProduct);
router.put('/:id', requireAdmin, validate(productUpdateSchema), updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
