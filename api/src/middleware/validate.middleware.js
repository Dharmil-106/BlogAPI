import { ValidationError } from '../errors/AppError.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => issue.message)
      .join(', ');

    const fieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.');
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }

    throw new ValidationError(message, fieldErrors);
  }

  req.body = result.data;
  next();
};