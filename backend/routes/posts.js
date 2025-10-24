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
  getPostByID,
} from "../controllers/posts.controller.js";
import Comment from "../models/Comment.js";

const router = express.Router();

// Define salary ranges (should match frontend)
const salaryRanges = [
  { label: "₹0–₹4L", min: 0, max: 400000 },
  { label: "₹4L–₹10L", min: 400000, max: 1000000 },
  { label: "₹10L+", min: 1000000, max: Number.MAX_SAFE_INTEGER }
];

// Middleware: Map salaryLabel query to salaryMin/salaryMax query params
function mapSalaryLabelToRange(req, res, next) {
  const { salaryLabel } = req.query;
  if (salaryLabel) {
    const range = salaryRanges.find(r => r.label === salaryLabel);
    if (!range) {
      return res.status(400).json({ error: "Invalid salaryLabel parameter" });
    }
    req.query.salaryMin = range.min;
    req.query.salaryMax = range.max;
  }
  next();
}

// Posts routes
router.get("/", mapSalaryLabelToRange, getAllPosts); // Salary filtering supported here!
router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.get("/:id", getPostByID);
router.patch("/:id/like", toggleLike);
router.get("/:postId/job-description", getJobDescriptionByPostId);

// Comments routes
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
