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
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);
    res.json(growth);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user growth' });
  }
});

// 2. Posts Activity by day (for Activity Hotspots)
router.get('/posts-activity', async (req, res) => {
  try {
    const startDate = getStartDate(req.query.range);
    const activity = await Post.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
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
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);
    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comments activity' });
  }
});

// 4. User Roles count for engagement pie chart
router.get('/user-roles', async (req, res) => {
  try {
    const roles = await User.aggregate([
      {
        $group: {
          _id: "$accountRole",
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user roles' });
  }
});

// 5. Top Active Users (by posts count + comments count)
router.get('/top-active-users', async (req, res) => {
  try {
    const startDate = getStartDate(req.query.range);

    // Aggregate posts count per user
    const postsCounts = await Post.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$createdBy",
          posts: { $sum: 1 }
        }
      }
    ]);

    // Aggregate comments count per user
    const commentsCounts = await Comment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$author",
          comments: { $sum: 1 }
        }
      }
    ]);

    // Merge postsCounts and commentsCounts by userId
    const combinedMap = new Map();

    postsCounts.forEach(p => {
      combinedMap.set(p._id.toString(), { userId: p._id, posts: p.posts, comments: 0, reactions: 0 });
    });
    commentsCounts.forEach(c => {
      const key = c._id.toString();
      if (combinedMap.has(key)) {
        combinedMap.get(key).comments = c.comments;
      } else {
        combinedMap.set(key, { userId: c._id, posts: 0, comments: c.comments, reactions: 0 });
      }
    });

    // Fetch user info for each userId and prepare final array
    const userIds = Array.from(combinedMap.keys());
    const users = await User.find({ _id: { $in: userIds } }, 'name avatar').lean();

    const result = users.map(user => {
      const stats = combinedMap.get(user._id.toString()) || { posts: 0, comments: 0, reactions: 0 };
      return {
        userId: user._id,
        name: user.name,
        avatar: user.avatar,
        posts: stats.posts,
        comments: stats.comments,
        reactions: stats.reactions, // Assuming reactions tracked separately, else 0
      };
    });

    // Sort top active users by combined activity (posts + comments)
    result.sort((a, b) => (b.posts + b.comments + b.reactions) - (a.posts + a.comments + a.reactions));

    res.json(result.slice(0, 10)); // Top 10 active users
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top active users' });
  }
});

export default router;
