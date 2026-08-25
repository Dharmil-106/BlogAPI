import { Router } from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import cloudinary from '../config/cloudinary.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', requireAuth, requireRole('AUTHOR'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) throw new Error('No image provided');

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'blog-api' },
        (error, result) => error ? reject(error) : resolve(result)
      );
      Readable.from(req.file.buffer).pipe(stream);
    });

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;