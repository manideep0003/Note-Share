/**
 * Wraps an async route handler to catch and forward errors to the error middleware
 * @param {Function} fn - Asynchronous route handler function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

