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
}, { _id: false }); // since it's embedded in User

export default educationSchema;
