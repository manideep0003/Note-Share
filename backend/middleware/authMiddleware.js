import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect middleware: Verifies JWT in Authorization header and attaches authenticated user
 */
export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
      errors: []
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
        errors: []
      });
    }

    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found',
        errors: []
      });
    }

    req.user = user;
    next();
  } catch (error) {
    let message = 'Not authorized, token invalid';

    if (error.name === 'TokenExpiredError') {
      message = 'Not authorized, token expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Not authorized, token malformed';
    }

    return res.status(401).json({
      success: false,
      message,
      errors: []
    });
  }
};

