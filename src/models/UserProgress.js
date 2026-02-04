import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    manualId: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedTopics: {
      type: [Number],
      default: [],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Índice único para evitar duplicatas
UserProgressSchema.index({ userId: 1, manualId: 1 }, { unique: true });

export default mongoose.models.UserProgress ||
  mongoose.model('UserProgress', UserProgressSchema);
