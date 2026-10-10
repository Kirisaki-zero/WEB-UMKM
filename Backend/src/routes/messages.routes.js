import { Router } from 'express';
import { createMessage } from '../controllers/messages.controller.js';
import { validate } from '../middleware/validate.js';
import { messageSchema } from '../validators/message.validator.js';

const router = Router();

// ── Publik ────────────────────────────────────────────────────────────────────
router.post('/', validate(messageSchema), createMessage); // POST /api/messages

export default router;
