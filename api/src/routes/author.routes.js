import express from 'express';
import * as authorController from '../controllers/author.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { authorUpdateSchema } from '../validators/author.validators.js';

const router = express.Router();

router.get('/', authorController.getProfile);
router.put('/', requireAuth, requireRole('AUTHOR'), validate(authorUpdateSchema), authorController.updateProfile);

export default router;
