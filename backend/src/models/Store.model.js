import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // minlength: 20,
      // maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 400,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Store', storeSchema);