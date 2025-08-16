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
  author: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
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
  }
});

// Create index for better search performance on tags & type
PostSchema.index({ tags: 1 });
PostSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model('Post', PostSchema);
