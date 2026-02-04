import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor, forneça um nome'],
    },
    email: {
      type: String,
      required: [true, 'Por favor, forneça um email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Por favor, forneça uma senha'],
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
