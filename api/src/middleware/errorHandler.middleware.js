import { AppError } from '../errors/AppError.js';

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    const body = {
      success: false,
      data: null,
      error: err.message,
      ...(err.errors && { errors: err.errors }),
    };
    return res.status(err.statusCode).json(body);
  }

  // Unknown/unexpected error — never leak details to the client
  console.error('Unhandled error:', err.message, err.stack);
  return res.status(500).json({
    success: false,
    data: null,
    error: 'Something went wrong. Please try again later.',
  });
}
