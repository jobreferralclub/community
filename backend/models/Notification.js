import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: null,
  },
  link: {
    type: String,
    trim: true,
    default: null,
  },
  seen: {
    type: Boolean,
    default: false, // false means the notification is unread
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default notificationSchema;
