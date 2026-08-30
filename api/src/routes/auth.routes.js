import { Router } from 'express';
import { register, login, googleLogin } from '../controllers/auth.controller.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema } from '../validators/auth.validators.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);

export default router;