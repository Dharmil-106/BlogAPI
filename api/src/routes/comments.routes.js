import { Router } from 'express';
import { getAllComments, createComment, deleteComment } from '../controllers/comments.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:postId', optionalAuth, getAllComments);
router.post('/:postId', requireAuth, createComment);
router.delete('/:postId/:id', requireAuth, deleteComment);

export default router;