export function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data, error: null });
}
