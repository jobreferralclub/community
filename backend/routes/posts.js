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

export default router;
