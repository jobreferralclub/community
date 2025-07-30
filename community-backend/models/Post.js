import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  author: String,
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['job-posting', 'success-story', 'discussion'],
    default: 'discussion'
  }
});

export default mongoose.model('Post', PostSchema);
