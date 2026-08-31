import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { uploadImage } from '../controllers/upload.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', requireAuth, requireRole('AUTHOR'), upload.single('image'), uploadImage);

export default router;