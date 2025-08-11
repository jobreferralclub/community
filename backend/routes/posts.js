import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

// Create new post
router.post('/', async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      likes: 0,
      comments: 0,
      likedBy: [],
      createdAt: new Date()
    });
    const saved = await post.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Toggle like on a post
router.patch('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.likes += 1; // always increment by 1

    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Get comments for a post
router.get('/:postId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

// Add a comment to a post
router.post('/:postId/comments', async (req, res) => {
  try {
    const { content, author, avatar } = req.body;
    const { postId } = req.params;

    const comment = new Comment({
      postId,
      content,
      author,
      avatar,
      createdAt: new Date()
    });

    const savedComment = await comment.save();

    // Increment comment count in post
    await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });

    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Delete a comment
router.delete('/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;

    // Find the comment first to get its postId
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    // Decrement comment count on the related post
    await Post.findByIdAndUpdate(comment.postId, { $inc: { comments: -1 } });

    res.json({ message: 'Comment deleted successfully', deleted: comment });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});


export default router;
