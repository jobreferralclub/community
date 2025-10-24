// models/Post.js

import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  links: {
    type: [String], // Stores useful resource links
    default: []
  },
  imageUrl: {
    type: String,
    default: '' // Stores uploaded image URL from backend
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  comments: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['job-posting', 'success-story', 'discussion'],
    default: 'discussion'
  },
  community: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job_description: {
    type: String,
    default: null
  },

  // New fields added for filtering
  location: {
    type: String,
    default: null
  },
  experienceLevel: {
  type: String,
  enum: ['intern', 'entry', 'mid', 'senior', 'director'],
  default: 'entry'
},
  jobType: {
  type: String,
  enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
  default: 'full-time'
},

  companyName: {
    type: String,
    default: null
  },
  salary: {
    type: Number, // Annual salary in smallest currency unit (e.g. paise, cents)
    default: null
  },
salaryMin: Number, // new field
salaryMax: Number, // new field
  jobTitle: {
  type: String,
  default: null
}
});

// Create index for better search performance on tags & type
PostSchema.index({ tags: 1 });
PostSchema.index({ type: 1, createdAt: -1 });

// Optional: add indexes on new fields for improved filter queries
PostSchema.index({ location: 1 });
PostSchema.index({ experienceLevel: 1 });
PostSchema.index({ jobType: 1 });
PostSchema.index({ companyName: 1 });
PostSchema.index({ salary: 1 });

export default mongoose.model('Post', PostSchema);
