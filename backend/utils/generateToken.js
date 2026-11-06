import jwt from 'jsonwebtoken';

/**
 * Generates a signed JSON Web Token (JWT) containing the user's ID
 * @param {string|mongoose.Types.ObjectId} userId - User identifier
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';

  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn }
  );
};

export default generateToken;

