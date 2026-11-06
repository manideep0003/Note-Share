import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get currently authenticated user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User profile not found',
      errors: ['User does not exist']
    });
  }

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    }
  });
});

/**
 * @desc    Update currently authenticated user's profile name and/or institutional email
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  // Disallow forbidden fields explicitly
  const forbiddenFields = ['_id', 'id', 'password', 'role', 'createdAt', 'updatedAt', '__v'];
  const attemptedForbidden = forbiddenFields.filter((field) => req.body[field] !== undefined);

  if (attemptedForbidden.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Modifying forbidden fields (${attemptedForbidden.join(', ')}) is not allowed`,
      errors: [`Field '${attemptedForbidden[0]}' cannot be updated through this endpoint`]
    });
  }

  const { name, email, currentPassword } = req.body;

  if (name === undefined && email === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name or email to update',
      errors: ['No update fields provided']
    });
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      errors: ['User account no longer exists']
    });
  }

  let isNameChanged = false;
  if (name !== undefined) {
    if (typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Name must be a valid string',
        errors: ['Invalid name type']
      });
    }

    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty or contain only whitespace',
        errors: ['Name cannot be blank']
      });
    }

    if (trimmedName.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot exceed 50 characters',
        errors: ['Name maximum length is 50 characters']
      });
    }

    if (trimmedName !== user.name) {
      user.name = trimmedName;
      isNameChanged = true;
    }
  }

  let isEmailChanged = false;
  if (email !== undefined) {
    if (typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email must be a valid string',
        errors: ['Invalid email type']
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
        errors: ['Invalid email format']
      });
    }

    if (normalizedEmail !== user.email.toLowerCase()) {
      // Current password verification is strictly required for email changes
      if (!currentPassword || typeof currentPassword !== 'string' || currentPassword.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change email address',
          errors: ['Current password verification is required']
        });
      }

      const isPasswordMatch = await user.comparePassword(currentPassword);
      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password',
          errors: ['The current password you entered is incorrect']
        });
      }

      // Check whether another user already owns the new email
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email is already registered',
          errors: ['Another user is already registered with this email address']
        });
      }

      user.email = normalizedEmail;
      isEmailChanged = true;
    }
  }

  // If no fields actually changed, return current profile data
  if (!isNameChanged && !isEmailChanged) {
    return res.status(200).json({
      success: true,
      message: 'No changes detected',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  }

  try {
    await user.save();
  } catch (saveError) {
    if (saveError.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
        errors: ['Another user is already registered with this email address']
      });
    }
    throw saveError;
  }

  let message = 'Profile updated successfully';
  if (isEmailChanged && isNameChanged) {
    message = 'Profile and email updated successfully';
  } else if (isEmailChanged) {
    message = 'Email address updated successfully';
  }

  res.status(200).json({
    success: true,
    message,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    }
  });
});

