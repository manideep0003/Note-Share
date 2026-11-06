import express from 'express';
import {
  getBookmarks,
  addBookmark,
  removeBookmark
} from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all bookmark routes
router.use(protect);

router.get('/', getBookmarks);
router.post('/:noteId', addBookmark);
router.delete('/:noteId', removeBookmark);

export default router;

