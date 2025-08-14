import express from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const router = express.Router();

/**
 * @route GET /api/posts
 * @desc ====================== GET ALL POSTS ====================== (newest first)
 */
router.get('/', async (req, res) => {
  try {
    // Return newest first
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

/**
 * @route POST /api/posts
 * @desc Create a new post
 */
router.post('/', async (req, res) => {
  try {
    // Destructure and normalize/validate incoming fields
    let { tags, links, imageUrl, ...rest } = req.body;

    // Ensure tags is always an array of clean strings
    if (typeof tags === 'string') {
      tags = tags.split(',').map(t => t.trim()).filter(Boolean);
    } else if (!Array.isArray(tags)) {
      tags = [];
    }

    // Ensure links is always an array of clean strings
    if (typeof links === 'string') {
      links = links.split(',').map(l => l.trim()).filter(Boolean);
    } else if (!Array.isArray(links)) {
      links = [];
    }

    // Ensure imageUrl is always a string
    if (typeof imageUrl !== 'string') {
      imageUrl = '';
    }

    const post = new Post({
      ...req.body,
      likes: 0,
      likedBy: [],
      comments: 0,
      createdAt: new Date()
    });

    const saved = await post.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

/**
 * @route PATCH /api/posts/:id/like
 * @desc ====================== TOGGLE LIKE ======================
 */
router.patch('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userIndex = post.likedBy.findIndex(uid => uid.toString() === userId);

    if (userIndex === -1) {
      post.likedBy.push(userId);
    } else {
      post.likedBy.splice(userIndex, 1);
    }

    post.likes = post.likedBy.length;

    post.likes = post.likedBy.length;

    post.likes = post.likedBy.length;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

/**
 * @route GET /api/posts/:postId/comments
 * @desc ====================== GET COMMENTS ======================
 */
router.get('/:postId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

/**
 * @route POST /api/posts/:postId/comments
 * @desc ====================== ADD COMMENT ======================
 */
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
    await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });

    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

/**
 * @route DELETE /api/posts/comments/:commentId
 * @desc ====================== DELETE COMMENT ====================== from a post
 */
router.delete('/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(comment.postId, { $inc: { comments: -1 } });

    res.json({ message: 'Comment deleted successfully', deleted: comment });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// ====================== DELETE POST ======================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await Comment.deleteMany({ postId: id });
    res.json({ message: 'Post deleted successfully', deleted: deletedPost });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// ====================== UPDATE POST ======================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

export default router;
