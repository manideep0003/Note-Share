import mongoose from 'mongoose';
import Note from '../models/Note.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadPDFToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

/**
 * @desc    Create and upload a new note
 * @route   POST /api/notes
 * @access  Private
 */
export const createNote = asyncHandler(async (req, res) => {
  const { title, description, subject, semester } = req.body;

  // Validate required text fields
  if (!title || !description || !subject || !semester) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields (title, description, subject, semester)',
      errors: ['title, description, subject, and semester are required']
    });
  }

  // Validate file presence
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'PDF file is required',
      errors: ['Please upload a PDF file under the "file" field']
    });
  }

  // Upload PDF buffer to Cloudinary
  let uploadResult;
  try {
    uploadResult = await uploadPDFToCloudinary(req.file.buffer, req.file.originalname);
  } catch (uploadError) {
    return res.status(500).json({
      success: false,
      message: 'Failed to upload PDF document to Cloudinary',
      errors: [uploadError.message]
    });
  }

  // Save Note record to MongoDB
  let note;
  try {
    note = await Note.create({
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      semester: semester.trim(),
      fileUrl: uploadResult.secure_url,
      filePublicId: uploadResult.public_id,
      fileType: 'application/pdf',
      uploadedBy: req.user._id,
      downloads: 0
    });
  } catch (dbError) {
    // Attempt rollback/cleanup of Cloudinary asset if DB write fails
    if (uploadResult?.public_id) {
      await deleteFromCloudinary(uploadResult.public_id, 'raw').catch(() => {});
    }
    throw dbError;
  }

  const populatedNote = await Note.findById(note._id).populate('uploadedBy', 'name role');

  res.status(201).json({
    success: true,
    message: 'Note uploaded successfully',
    data: {
      note: populatedNote
    }
  });
});

/**
 * @desc    Get all notes with optional search, subject/semester filters, and pagination
 * @route   GET /api/notes
 * @access  Public
 */
export const getAllNotes = asyncHandler(async (req, res) => {
  let { search, subject, semester, page = 1, limit = 10 } = req.query;

  // Parse and validate pagination parameters
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;
  if (limit > 50) limit = 50; // Enforce maximum limit of 50

  const query = {};

  // Search filter across title, description, and subject
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { subject: searchRegex }
    ];
  }

  // Subject exact/case-insensitive filter
  if (subject && subject.trim()) {
    query.subject = new RegExp(`^${subject.trim()}$`, 'i');
  }

  // Semester filter
  if (semester && semester.trim()) {
    query.semester = semester.trim();
  }

  const total = await Note.countDocuments(query);
  const totalPages = Math.ceil(total / limit) || 0;
  const skip = (page - 1) * limit;

  const notes = await Note.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('uploadedBy', 'name role');

  res.status(200).json({
    success: true,
    message: 'Notes retrieved successfully',
    data: {
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }
  });
});

/**
 * @desc    Get a single note by ID
 * @route   GET /api/notes/:id
 * @access  Public
 */
export const getNoteById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Note ID format',
      errors: ['Provided ID is not a valid MongoDB ObjectId']
    });
  }

  const note = await Note.findById(id).populate('uploadedBy', 'name role');

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found',
      errors: ['No note found with the provided ID']
    });
  }

  res.status(200).json({
    success: true,
    message: 'Note retrieved successfully',
    data: {
      note
    }
  });
});

/**
 * @desc    Update a note (Owner or Admin)
 * @route   PUT /api/notes/:id
 * @access  Private
 */
export const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Note ID format',
      errors: ['Provided ID is not a valid MongoDB ObjectId']
    });
  }

  const note = await Note.findById(id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found',
      errors: ['No note found with the provided ID']
    });
  }

  // Authorization check: only owner or admin can update
  const isOwner = note.uploadedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this note',
      errors: ['Only the owner or an administrator can update this note']
    });
  }

  const { title, description, subject, semester } = req.body;

  if (title) note.title = title.trim();
  if (description) note.description = description.trim();
  if (subject) note.subject = subject.trim();
  if (semester) note.semester = semester.trim();

  let newUploadResult = null;
  const oldPublicId = note.filePublicId;

  // Handle PDF file replacement if provided
  if (req.file) {
    try {
      newUploadResult = await uploadPDFToCloudinary(req.file.buffer, req.file.originalname);
      note.fileUrl = newUploadResult.secure_url;
      note.filePublicId = newUploadResult.public_id;
    } catch (uploadError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload replacement PDF document',
        errors: [uploadError.message]
      });
    }
  }

  // Save the updated note
  try {
    note.updatedAt = new Date();
    await note.save();
  } catch (dbError) {
    // If DB update fails, clean up the newly uploaded asset
    if (newUploadResult?.public_id) {
      await deleteFromCloudinary(newUploadResult.public_id, 'raw').catch(() => {});
    }
    throw dbError;
  }

  // Delete old Cloudinary asset only after the DB update succeeds
  if (newUploadResult && oldPublicId) {
    deleteFromCloudinary(oldPublicId, 'raw').catch((err) => {
      console.error(`Warning: Failed to delete previous Cloudinary asset ${oldPublicId}:`, err.message);
    });
  }

  const updatedNote = await Note.findById(note._id).populate('uploadedBy', 'name role');

  res.status(200).json({
    success: true,
    message: 'Note updated successfully',
    data: {
      note: updatedNote
    }
  });
});

/**
 * @desc    Delete a note and its Cloudinary asset (Owner or Admin)
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
export const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Note ID format',
      errors: ['Provided ID is not a valid MongoDB ObjectId']
    });
  }

  const note = await Note.findById(id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found',
      errors: ['No note found with the provided ID']
    });
  }

  // Authorization check: only owner or admin can delete
  const isOwner = note.uploadedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this note',
      errors: ['Only the owner or an administrator can delete this note']
    });
  }

  const filePublicId = note.filePublicId;

  // Delete from MongoDB
  await Note.findByIdAndDelete(id);

  // Delete associated Cloudinary asset
  let cloudinaryError = null;
  if (filePublicId) {
    try {
      await deleteFromCloudinary(filePublicId, 'raw');
    } catch (err) {
      cloudinaryError = err.message;
      console.error(`Warning: Cloudinary deletion failed for ${filePublicId}:`, err.message);
    }
  }

  if (cloudinaryError) {
    return res.status(200).json({
      success: true,
      message: 'Note removed from database, but Cloudinary asset deletion encountered an issue',
      data: {
        noteId: id,
        cloudinaryStatus: 'cleanup_pending'
      }
    });
  }

  res.status(200).json({
    success: true,
    message: 'Note deleted successfully',
    data: {
      noteId: id
    }
  });
});

/**
 * @desc    Get notes uploaded by the current authenticated user
 * @route   GET /api/notes/my-uploads
 * @access  Private
 */
export const getMyUploads = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;
  if (limit > 50) limit = 50;

  const query = { uploadedBy: req.user._id };

  const total = await Note.countDocuments(query);
  const totalPages = Math.ceil(total / limit) || 0;
  const skip = (page - 1) * limit;

  const notes = await Note.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('uploadedBy', 'name role');

  res.status(200).json({
    success: true,
    message: 'My notes retrieved successfully',
    data: {
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }
  });
});

