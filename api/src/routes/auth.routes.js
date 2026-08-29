import { Router } from 'express';
import { register, login, googleLogin } from '../controllers/auth.controller.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);

export default router;