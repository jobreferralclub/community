import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  accountRole: {
    type: String,
    enum: ['member', 'recruiter', 'TPO', 'admin'],
    default: 'member',
    required: true
  },
  avatar: {
    type: String, // Store image URL or file path
    default: null, // Default avatar
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);