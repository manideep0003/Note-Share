import multer from 'multer';
import path from 'path';

// Memory storage keeps file buffers in memory for direct stream upload to Cloudinary
const storage = multer.memoryStorage();

// File filter checking MIME type and extension
const fileFilter = (req, file, cb) => {
  const allowedExts = ['.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedExts.includes(ext) && (mime === 'application/pdf' || mime === 'application/x-pdf')) {
    cb(null, true);
  } else {
    const error = new Error('Only PDF files are allowed');
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 Megabytes maximum
  },
  fileFilter
});

/**
 * Validates whether the given buffer starts with standard PDF magic bytes (%PDF)
 * @param {Buffer} buffer
 * @returns {boolean}
 */
export const isValidPDFBuffer = (buffer) => {
  if (!buffer || buffer.length < 4) return false;
  return (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  );
};

/**
 * Middleware handling single PDF file upload under the 'file' field
 */
export const uploadNoteFile = (req, res, next) => {
  const singleUpload = upload.single('file');

  singleUpload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          message: 'File size exceeds maximum allowed limit of 10MB',
          errors: ['File size too large (max: 10MB)']
        });
      }

      if (err.code === 'INVALID_FILE_TYPE' || err.message === 'Only PDF files are allowed') {
        return res.status(400).json({
          success: false,
          message: 'Only PDF documents are supported',
          errors: ['Invalid file type. Please upload a valid .pdf file']
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error',
        errors: [err.message]
      });
    }

    // If file is present, verify magic bytes
    if (req.file) {
      if (!isValidPDFBuffer(req.file.buffer)) {
        return res.status(400).json({
          success: false,
          message: 'Uploaded file is not a valid PDF document',
          errors: ['File header signature does not match PDF format']
        });
      }
    }

    next();
  });
};

