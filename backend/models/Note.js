import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a note title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a note description'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject name'],
      trim: true
    },
    semester: {
      type: String,
      required: [true, 'Please provide a semester'],
      trim: true
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required']
    },
    filePublicId: {
      type: String,
      required: [true, 'File public ID is required']
    },
    fileType: {
      type: String,
      default: 'application/pdf'
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader reference is required']
    },
    downloads: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes for optimized searching and filtering
noteSchema.index({ title: 'text', description: 'text', subject: 'text' });
noteSchema.index({ subject: 1, semester: 1 });
noteSchema.index({ uploadedBy: 1 });
noteSchema.index({ createdAt: -1 });

const Note = mongoose.model('Note', noteSchema);

export default Note;

