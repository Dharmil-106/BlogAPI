export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => issue.message)
      .join(', ');
    return res.status(400).json({ error: message });
  }

  req.body = result.data;
  next();
};