import mongoose  from 'mongoose';

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
  },
  community: {
    type: String,
    required: true,       // Optional, if you want to enforce a community
    enum: ['analyst', 'operations', 'human-resource', 'marketing', 'general'] // example communities
  }
});


export default mongoose.model('Post', PostSchema);
