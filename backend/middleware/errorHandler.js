/**
 * Centralized error handler. Keep error responses generic in production
 * to avoid leaking stack traces / internals in a forensic tool that may
 * itself be scrutinized.
 */
function errorHandler(err, req, res, next) {
  console.error('[error]', err);

  const status = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  res.status(status).json({
    error: isProd ? 'An unexpected error occurred.' : err.message,
    ...(isProd ? {} : { stack: err.stack }),
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: `No route: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFoundHandler };
