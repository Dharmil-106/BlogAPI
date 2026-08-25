import { Router } from 'express';
import { getPostComments, getAllComments, createComment, deleteComment } from '../controllers/comments.controller.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, requireRole('AUTHOR'), getAllComments);
router.get('/:postId', optionalAuth, getPostComments);
router.post('/:postId', requireAuth, createComment);
router.delete('/:postId/:id', requireAuth, deleteComment);

export default router;