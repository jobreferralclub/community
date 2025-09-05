import express from "express";
import User from "../models/User.js";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteAllUsers,
  getUserRole,
  updateUserRole,
  loginUser,
  googleLogin,
} from "../controllers/users.controller.js";
import { auth0Login } from "../controllers/auth0.controller.js";


const router = express.Router();

// CRUD
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.delete("/", deleteAllUsers);
router.post("/auth0", auth0Login);

// Role management
router.get("/:id/role", getUserRole);
router.patch("/:id/role", updateUserRole);

// Auth
router.post("/login", loginUser);
router.post("/google", googleLogin);

//Gamification
router.get("/:userId/gamification", async (req, res) => {
  const userId = req.params.userId;
  console.log("Fetching gamification stats for userId:", userId);

  try {
    // Fetch all necessary fields including resume components
    const user = await User.findById(userId)
      .select(
        "postsCount commentsCount likesCount name email avatar phone skills work education projects certificates"
      );
    console.log("User data fetched:", user);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    let totalPoints =
      (user.postsCount || 0) * 10 +
      (user.commentsCount || 0) * 5 +
      (user.likesCount || 0) * 5;

    let profileUpdatesCount = 0;
    let resumeUpdatesCount = 0;

    // Profile completion logic
    if (user.name && user.email && user.avatar && user.phone) {
      totalPoints += 15;
      profileUpdatesCount += 1;
    }

    // Resume update count: increment by 1 if any resume section is present and not empty
    if (
      (user.skills && user.skills.length > 0) ||
      (user.work && user.work.length > 0) ||
      (user.education && user.education.length > 0) ||
      (user.projects && user.projects.length > 0) ||
      (user.certificates && user.certificates.length > 0)
    ) {
      resumeUpdatesCount += 1;
      totalPoints += 15;
    }

    res.json({
      postsCount: user.postsCount || 0,
      commentsCount: user.commentsCount || 0,
      likesCount: user.likesCount || 0,
      profileUpdatesCount,
      resumeUpdatesCount,
      totalPoints
    });
  } catch (error) {
    console.error("Error fetching gamification stats:", error);
    res.status(500).json({ error: "Failed to fetch gamification stats" });
  }
});

export default router;
