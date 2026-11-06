import express from 'express';
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getMyUploads
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadNoteFile } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllNotes);

// Authenticated upload route
router.post('/', protect, uploadNoteFile, createNote);

// User-specific uploads route (MUST come before /:id to prevent route shadowing)
router.get('/my-uploads', protect, getMyUploads);

// Single note operations
router.get('/:id', getNoteById);
router.put('/:id', protect, uploadNoteFile, updateNote);
router.delete('/:id', protect, deleteNote);

export default router;

