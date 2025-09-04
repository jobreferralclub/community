// src/controllers/postController.js
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Community from "../models/Community.js";
import User from "../models/User.js";

// ========== POSTS ==========

// Get all posts (newest first)
export const getAllPosts = async (req, res) => {
  try {
    const { community } = req.body;

    // Build query condition
    const query = community ? { community } : {};

    // Fetch posts with optional filter
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .select('-job_description')   // exclude job_description
      .populate('createdBy', 'name avatar');

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to get posts" });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    let { tags, links, imageUrl, userId, communityId, ...rest } = req.body;

    // Normalize tags
    if (typeof tags === "string") {
      tags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    } else if (!Array.isArray(tags)) {
      tags = [];
    }

    // Normalize links
    if (typeof links === "string") {
      links = links.split(",").map((l) => l.trim()).filter(Boolean);
    } else if (!Array.isArray(links)) {
      links = [];
    }

    // Ensure imageUrl is a string
    if (typeof imageUrl !== "string") {
      imageUrl = "";
    }

    // ✅ Create post
    const post = new Post({
      ...rest,
      tags,
      links,
      imageUrl,
      likes: 0,
      comments: 0,
      likedBy: [],
      createdAt: new Date(),
      createdBy: userId || null,
    });

    const savedPost = await post.save();
    if (userId) {
  await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });
}

    // ✅ Attach post to community & increment postCount
    if (communityId) {
      await Community.findByIdAndUpdate(
        communityId,
        {
          $push: { posts: { postId: savedPost._id, createdAt: savedPost.createdAt } },
          $inc: { postCount: 1 },
        },
        { new: true }
      );
    }

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    let { tags, links, imageUrl, ...rest } = req.body;

    // Normalize tags
    if (typeof tags === "string") {
      tags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    } else if (!Array.isArray(tags)) {
      tags = [];
    }

    // Normalize links
    if (typeof links === "string") {
      links = links.split(",").map((l) => l.trim()).filter(Boolean);
    } else if (!Array.isArray(links)) {
      links = [];
    }

    // Ensure imageUrl is a string
    if (typeof imageUrl !== "string") {
      imageUrl = "";
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { ...rest, tags, links, imageUrl, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ error: "Post not found" });

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) return res.status(404).json({ error: "Post not found" });

    // Also delete related comments
    await Comment.deleteMany({ postId: id });

    res.json({ message: "Post deleted successfully", deleted: deletedPost });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// Toggle like on a post
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params; // post ID
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userIndex = post.likedBy.indexOf(userId);
    let incrementLikes = 0;

    if (userIndex === -1) {
      // Like
      post.likedBy.push(userId);
      incrementLikes = 1;
    } else {
      // Unlike
      post.likedBy.splice(userIndex, 1);
      incrementLikes = -1;
    }

    post.likes = post.likedBy.length;
    await post.save();

    // Update the user's likesCount counter
    if (incrementLikes !== 0) {
      await User.findByIdAndUpdate(userId, { $inc: { likesCount: incrementLikes } });
    }

    res.json(post);
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};


// ========== COMMENTS ==========

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to get comments" });
  }
};

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { content, author, userId, avatar, imageUrl } = req.body;
    const { postId } = req.params;

    const comment = new Comment({
      postId,
      content,
      author,
      userId,
      avatar,
      imageUrl,
      createdAt: new Date(),
    });

    const savedComment = await comment.save();
    if (userId) {
  await User.findByIdAndUpdate(userId, { $inc: { commentsCount: 1 } });
}

    // Increment comment count
    await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });

    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await Comment.findByIdAndDelete(commentId);

    // Decrement related post's comment count
    await Post.findByIdAndUpdate(comment.postId, { $inc: { comments: -1 } });

    res.json({ message: "Comment deleted successfully", deleted: comment });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
// Get comment count for a specific user
export const getCommentCountByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const count = await Comment.countDocuments({ userId });
    res.json({ userId, commentCount: count });
  } catch (error) {
    console.error("Error counting comments by user:", error);
    res.status(500).json({ error: "Failed to count comments by user" });
  }
};