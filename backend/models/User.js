import mongoose from "mongoose";
import educationSchema from "./Education.js";
import workSchema from "./Work.js";
import projectSchema from "./Project.js";
import skillSchema from "./Skill.js";
import certificateSchema from "./Certificate.js";
import notificationSchema from "./Notification.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  accountRole: {
    type: String,
    enum: ["member", "recruiter", "tpo", "admin"],
    default: "member",
    required: true,
  },
  avatar: {
    type: String,
    default: null,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  postsCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  profileUpdatesCount: {
    type: Number,
    default: 0,
  },
  resumeUpdatesCount: {
    type: Number,
    default: 0,
  },
  referralsCount: {
    type: Number,
    default: 0,
  },
  totalPointsCount: {
    type: Number,
    default: 0,
  },
  job_title: String,
  company: String,
  location: String,
  bio: String,
  phone: String,

  // ✅ Embedded sub-documents
  education: [educationSchema],
  work: [workSchema],
  projects: [projectSchema],
  skills: [skillSchema],
  certificates: [certificateSchema],
  notifications: [notificationSchema],
});

export default mongoose.model("User", userSchema);
