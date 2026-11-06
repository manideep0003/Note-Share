import { validationResult } from 'express-validator';

/**
 * Middleware that checks for express-validator errors and returns standardized 400 response
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: errorMessages[0] || 'Validation error',
      errors: errorMessages
    });
  }

  next();
};

