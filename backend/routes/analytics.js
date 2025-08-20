import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

const router = express.Router();

// Helper to get date range from query param, default 30 days ago
const getStartDate = (range) => {
  const now = new Date();
  switch (range) {
    case '7d':
      now.setDate(now.getDate() - 7);
      break;
    case '90d':
      now.setDate(now.getDate() - 90);
      break;
    case '1y':
      now.setFullYear(now.getFullYear() - 1);
      break;
    case '30d':
    default:
      now.setDate(now.getDate() - 30);
  }
  return now;
};

// 1. User Growth (new user signups per day)
router.get('/user-growth', async (req, res) => {
  try {
    const startDate = getStartDate(req.query.range);
    const growth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);
    res.json(growth);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user growth' });
  }
});

// 2. Posts Activity by day
router.get('/posts-activity', async (req, res) => {
  try {
    const startDate = getStartDate(req.query.range);
    const activity = await Post.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);
    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts activity' });
  }
});

// 3. Comments Activity by day
router.get('/comments-activity', async (req, res) => {
  try {
    const startDate = getStartDate(req.query.range);
    const activity = await Comment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);
    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comments activity' });
  }
});

// 4. User Roles count
router.get('/user-roles', async (req, res) => {
  try {
    const roles = await User.aggregate([
      {
        $group: {
          _id: '$accountRole',
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user roles' });
  }
});

// 5. Top Active Users (by sum of posts + comments)
router.get('/top-active-users', async (req, res) => {
  try {
    const startDate = getStartDate(req.query.range);

    const postsCounts = await Post.aggregate([
      { $match: { createdAt: { $gte: startDate }, createdBy: { $ne: null } } },
      {
        $group: {
          _id: '$createdBy',
          posts: { $sum: 1 },
        },
      },
    ]);

    const commentsCounts = await Comment.aggregate([
      { $match: { createdAt: { $gte: startDate }, userId: { $ne: null } } },
      {
        $group: {
          _id: '$userId',
          comments: { $sum: 1 },
        },
      },
    ]);

    const combinedMap = new Map();

    postsCounts.forEach((p) => {
      if (p._id) {
        combinedMap.set(p._id.toString(), { userId: p._id, posts: p.posts, comments: 0 });
      }
    });

    commentsCounts.forEach((c) => {
      if (c._id) {
        const key = c._id.toString();
        if (combinedMap.has(key)) {
          combinedMap.get(key).comments = c.comments;
        } else {
          combinedMap.set(key, { userId: c._id, posts: 0, comments: c.comments });
        }
      }
    });

    const userIds = Array.from(combinedMap.keys());
    const users = await User.find({ _id: { $in: userIds } }, 'name avatar').lean();

    const result = users.map((user) => {
      const stats = combinedMap.get(user._id.toString()) || { posts: 0, comments: 0 };
      return {
        userId: user._id,
        name: user.name,
        avatar: user.avatar,
        posts: stats.posts,
        comments: stats.comments,
        totalActivity: stats.posts + stats.comments,
      };
    });

    result.sort((a, b) => b.totalActivity - a.totalActivity);

    res.json(result.slice(0, 10));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top active users' });
  }
});

router.get('/', (req, res) => {
  res.send('analytics');
});

export default router;
