import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
  },
  { timestamps: true }
);

ratingSchema.index({ user: 1, store: 1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema);