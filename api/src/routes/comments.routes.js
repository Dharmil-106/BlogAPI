import { Router } from 'express';
import { getPostComments, getAllComments, createComment, deleteComment } from '../controllers/comments.controller.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createCommentSchema } from '../validators/comments.validators.js';

const router = Router();

router.get('/', requireAuth, requireRole('AUTHOR'), getAllComments);
router.get('/:postId', optionalAuth, getPostComments);
router.post('/:postId', requireAuth, validate(createCommentSchema), createComment);
router.delete('/:postId/:id', requireAuth, deleteComment);

export default router;