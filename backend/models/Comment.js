const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  content: String,
  author: String,
  avatar: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);