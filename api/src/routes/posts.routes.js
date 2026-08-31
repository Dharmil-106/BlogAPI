import { Router } from 'express';
import { getAllPosts, getPost, createPost, deletePost, updatePost, togglePublish } from '../controllers/posts.controller.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPostSchema, updatePostSchema } from '../validators/posts.validators.js';

const router = Router();

router.get('/', optionalAuth, getAllPosts);
router.get('/:id', optionalAuth, getPost);
router.post('/', requireAuth, requireRole('AUTHOR'), validate(createPostSchema), createPost);
router.put('/:id', requireAuth, requireRole('AUTHOR'), validate(updatePostSchema), updatePost);
router.delete('/:id', requireAuth, requireRole('AUTHOR'), deletePost);
router.patch('/:id/publish', requireAuth, requireRole('AUTHOR'), togglePublish)

export default router;