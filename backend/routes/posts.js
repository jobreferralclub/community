import express from 'express';
import Post from '../models/Post.js';
// import Comment from '../models/Comment.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  const saved = await newPost.save();
  res.status(201).json(saved);
});

router.patch('/:id/like', async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  res.json(post);
});

router.createPost = async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      likes: 0,
      comments: 0,
      likedBy: [],
      created_at: new Date()
    });
    const saved = await post.save();
    res.json(saved);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

router.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ created_at: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
};

router.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.likedBy.includes(userId)) {
      post.likes -= 1;
      post.likedBy.pull(userId);
    } else {
      post.likes += 1;
      post.likedBy.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

router.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ created_at: 1 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
};

router.addComment = async (req, res) => {
  try {
    const { postId, content, author, avatar } = req.body;

    const comment = new Comment({
      postId,
      content,
      author,
      avatar,
      created_at: new Date()
    });

    const savedComment = await comment.save();

    await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });

    res.json(savedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

export default router;
