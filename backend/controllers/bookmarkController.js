import mongoose from 'mongoose';
import Bookmark from '../models/Bookmark.js';
import Note from '../models/Note.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all bookmarks for the authenticated user
 * @route   GET /api/bookmarks
 * @access  Private
 */
export const getBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate({
      path: 'note',
      select: 'title description subject semester fileUrl fileType uploadedBy downloads createdAt updatedAt',
      populate: {
        path: 'uploadedBy',
        select: 'name role'
      }
    });

  // Safely handle any bookmarks referencing notes that may have been deleted
  const safeBookmarks = bookmarks.filter((b) => b.note !== null);

  res.status(200).json({
    success: true,
    message: 'Bookmarks retrieved successfully',
    data: {
      bookmarks: safeBookmarks
    }
  });
});

/**
 * @desc    Bookmark a note
 * @route   POST /api/bookmarks/:noteId
 * @access  Private
 */
export const addBookmark = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Note ID format',
      errors: ['Provided note ID is not a valid MongoDB ObjectId']
    });
  }

  // Check whether note exists in MongoDB
  const note = await Note.findById(noteId);
  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found',
      errors: ['No note found with the provided ID']
    });
  }

  // Check whether bookmark already exists
  const existingBookmark = await Bookmark.findOne({
    user: req.user._id,
    note: noteId
  });

  if (existingBookmark) {
    return res.status(409).json({
      success: false,
      message: 'Note is already bookmarked',
      errors: ['User has already bookmarked this note']
    });
  }

  try {
    const bookmark = await Bookmark.create({
      user: req.user._id,
      note: noteId
    });

    res.status(201).json({
      success: true,
      message: 'Note bookmarked successfully',
      data: {
        bookmark: {
          _id: bookmark._id,
          user: bookmark.user,
          note: bookmark.note,
          createdAt: bookmark.createdAt
        }
      }
    });
  } catch (err) {
    // Handle duplicate key error (E11000) race conditions safely
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Note is already bookmarked',
        errors: ['User has already bookmarked this note']
      });
    }
    throw err;
  }
});

/**
 * @desc    Remove a bookmark
 * @route   DELETE /api/bookmarks/:noteId
 * @access  Private
 */
export const removeBookmark = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Note ID format',
      errors: ['Provided note ID is not a valid MongoDB ObjectId']
    });
  }

  // Delete only bookmark matching both user and noteId
  const bookmark = await Bookmark.findOneAndDelete({
    user: req.user._id,
    note: noteId
  });

  if (!bookmark) {
    return res.status(404).json({
      success: false,
      message: 'Bookmark not found',
      errors: ['No bookmark found for this note']
    });
  }

  res.status(200).json({
    success: true,
    message: 'Bookmark removed successfully',
    data: {}
  });
});

