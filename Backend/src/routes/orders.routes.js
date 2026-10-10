import { Router } from 'express';
import {
  createOrder,
  getOrderByCode,
  getOrders,
  updateOrderStatus,
} from '../controllers/orders.controller.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { validate } from '../middleware/validate.js';
import { orderSchema, orderStatusSchema } from '../validators/order.validator.js';

const router = Router();

// ── Publik ────────────────────────────────────────────────────────────────────
router.post('/', validate(orderSchema), createOrder);     // POST /api/orders
router.get('/:code', getOrderByCode);                     // GET  /api/orders/:code

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get('/', requireAdmin, getOrders);                                             // GET    /api/orders?status=&page=
router.patch('/:id/status', requireAdmin, validate(orderStatusSchema), updateOrderStatus); // PATCH  /api/orders/:id/status

export default router;
