/**
 * Middleware to handle 404 (Not Found) routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized error handling middleware
 * Enforces standardized error response format:
 * {
 *   "success": false,
 *   "message": "Something went wrong",
 *   "errors": []
 * }
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong',
    errors: err.errors || []
  });
};
