import express from 'express';
import * as authorController from '../controllers/author.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authorController.getProfile);
router.put('/', requireAuth, requireRole('AUTHOR'), authorController.updateProfile);

export default router;
