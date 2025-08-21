import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  startMonth: {
    type: Date, // store as Date for easy formatting
    required: true,
  },
  endMonth: {
    type: Date,
  },
  currentlyOngoing: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
  },
  projectLink: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true; // optional field
        return /^https?:\/\/.+/.test(v); // only allow http/https
      },
      message: "Invalid project link URL",
    },
  },
}, { _id: false }); // embedded inside User

export default projectSchema;
