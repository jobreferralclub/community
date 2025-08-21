import mongoose from "mongoose";

const workSchema = new mongoose.Schema({
  workType: {
    type: String,
    enum: ["fullTime", "partTime", "internship", "volunteering"],
    required: true,
  },
  designation: {
    type: String,
    required: true,
    trim: true,
  },
  profile: {
    type: String,
    trim: true, // only meaningful for fullTime, but not required
  },
  organization: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  isRemote: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  currentlyWorking: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
  },
}, { _id: false }); // since embedded in user

export default workSchema;
