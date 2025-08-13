import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  links: [String], // ✅ added in case posts have links
  imageUrl: { type: String, default: '' }, // ✅ added so uploaded image URL is saved
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
  }
});

export default mongoose.model('Post', PostSchema);
