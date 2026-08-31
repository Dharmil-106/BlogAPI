import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';
import { BadRequestError } from '../errors/AppError.js';
import { sendSuccess } from '../utils/sendSuccess.js';

export async function uploadImage(req, res) {
  if (!req.file) throw new BadRequestError('No image provided');

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'blog-api' },
      (error, result) => error ? reject(error) : resolve(result)
    );
    Readable.from(req.file.buffer).pipe(stream);
  });

  sendSuccess(res, { url: result.secure_url });
}

