import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Register a new student user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password',
      errors: ['All fields (name, email, password) are required']
    });
  }

  name = name.trim();
  email = email.trim().toLowerCase();

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
      errors: ['Invalid email format']
    });
  }

  // Enforce password minimum length of 6
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
      errors: ['Password length must be at least 6 characters']
    });
  }

  // Check whether email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(409).json({
      success: false,
      message: 'Email is already registered',
      errors: ['User already exists with this email address']
    });
  }

  // Create user - Always assign role = 'student' regardless of any role in request body
  const user = await User.create({
    name,
    email,
    password,
    role: 'student'
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password',
      errors: ['Email and password are required']
    });
  }

  email = email.trim().toLowerCase();

  // Find user by normalized email
  const user = await User.findOne({ email });

  if (!user) {
    // Generic error: never reveal whether email or password was wrong
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
      errors: ['Invalid credentials']
    });
  }

  // Compare passwords
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    // Generic error: never reveal whether email or password was wrong
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
      errors: ['Invalid credentials']
    });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
});

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, user not found',
      errors: []
    });
  }

  res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
});

