import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: [
      "secondary",
      "seniorSecondary",
      "graduation",
      "diploma",
      "phd"
    ],
    required: true
  },
  institution: {
    type: String,
    required: true,
    trim: true
  },
  startYear: {
    type: String,
    trim: true
  },
  endYear: {
    type: String,
    trim: true
  },
  board: {
    type: String,
    trim: true
  },
  stream: {
    type: String,
    trim: true
  },
  degree: {
    type: String,
    trim: true
  },
  scoreType: {
    type: String,
    enum: ["Percentage", "CGPA"],
    default: "Percentage"
  },
  performance: {
    type: String, // e.g. "85" or "9.2"
    trim: true
  }
}, { _id: false });

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
    type: String,
    default: null,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  job_title: String,
  company: String,
  location: String,
  bio: String,
  phone: String,

  // ✅ New field: array of education records
  education: [educationSchema]
});

export default mongoose.model('User', userSchema);
