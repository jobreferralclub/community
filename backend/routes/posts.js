// src/routes/posts.js
import express from "express";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getComments,
  addComment,
  deleteComment,
  getCommentCountByUser,
  getJobDescriptionByPostId,
} from "../controllers/posts.controller.js";
import Comment from "../models/Comment.js";

const router = express.Router();

// Posts
router.get("/", getAllPosts);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/:id/like", toggleLike);
router.get("/:postId/job-description", getJobDescriptionByPostId);

// Comments getComments
router.get("/:postId/comments", getComments);
router.post("/:postId/comments", addComment);
router.delete("/comments/:commentId", deleteComment);
router.get('/comments-count/:userId', getCommentCountByUser);

router.get("/comments", async (req, res) => {
  try {
    // Fetch all comments, return only _id and userId
    const comments = await Comment.find().select("_id userId postId");

    // Format response
    const formatted = comments.map(c => ({
      comment_id: c._id,
      user_id: c.userId,
      post_id: c.postId
    }));

    res.json({ count: formatted.length, comments: formatted });
  } catch (error) {
    console.error("Error fetching all comments:", error.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

export default router;
