import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: [true, 'Note reference is required']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

// Compound unique index ensuring a user cannot bookmark the exact same note more than once
bookmarkSchema.index({ user: 1, note: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;

