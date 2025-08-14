import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const router = express.Router();

/**
 * @route GET /api/posts
 * @desc Get all posts (newest first)
 */
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

/**
 * @route POST /api/posts
 * @desc Create a new post (with tags, links, and imageUrl handling)
 */
router.post('/', async (req, res) => {
  try {
    let { tags, links, imageUrl, ...rest } = req.body;

    // Normalize tags
    if (typeof tags === 'string') {
      tags = tags.split(',').map(t => t.trim()).filter(Boolean);
    } else if (!Array.isArray(tags)) {
      tags = [];
    }

    // Normalize links
    if (typeof links === 'string') {
      links = links.split(',').map(l => l.trim()).filter(Boolean);
    } else if (!Array.isArray(links)) {
      links = [];
    }

    // Ensure imageUrl is a string
    if (typeof imageUrl !== 'string') {
      imageUrl = '';
    }

    const post = new Post({
      ...rest,
      tags,
      links,
      imageUrl,
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

/**
 * @route PATCH /api/posts/:id/like
 * @desc Toggle like on a post
 */
router.patch('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userIndex = post.likedBy.indexOf(userId);

    if (userIndex === -1) {
      // Like
      post.likedBy.push(userId);
    } else {
      // Unlike
      post.likedBy.splice(userIndex, 1);
    }

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
 * @desc Get comments for a post
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
 * @desc Add a comment to a post
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

    // Increment comment count
    await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });

    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

/**
 * @route DELETE /api/posts/comments/:commentId
 * @desc Delete a comment from a post
 */
router.delete('/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await Comment.findByIdAndDelete(commentId);

    // Decrement related post's comment count
    await Post.findByIdAndUpdate(comment.postId, { $inc: { comments: -1 } });

    res.json({ message: 'Comment deleted successfully', deleted: comment });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;
