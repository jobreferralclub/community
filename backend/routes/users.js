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
import axios from "axios";


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
router.put("/:id/role", updateUserRole);

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

router.get("/leadersboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Fetch all users sorted by points
    const users = await User.find()
      .select("name avatar totalPointsCount")
      .sort({ totalPointsCount: -1, createdAt: 1 });

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    // ✅ Assign ranks
    const rankedUsers = users.map((u, idx) => ({
      id: u._id,
      name: u.name,
      avatar: u.avatar,
      points: u.totalPointsCount || 0,
      rank: idx + 1,
    }));

    // ✅ Find current user
    const currentUser = rankedUsers.find((u) => u.id.toString() === userId);

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    let leaderboard = [];

    if (currentUser.rank <= 10) {
      // If user is already in top 10 → just return top 10
      leaderboard = rankedUsers.slice(0, 10);
    } else {
      // Otherwise return top 9 + current user
      leaderboard = [...rankedUsers.slice(0, 9), currentUser];
    }

    res.json({
      message: "Leaderboard fetched successfully",
      leaderboard,
      currentUser,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error.message);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

router.post("/sync-points", async (req, res) => {
  console.log("Syncing total points for all users...");

  try {
    // ✅ Step 1: Fetch all users
    const users = await User.find().select(
      "postsCount commentsCount likesCount name email avatar phone skills work education projects certificates"
    );

    let updatedUsers = [];

    for (let user of users) {
      // ✅ Base points
      let totalPoints =
        (user.postsCount || 0) * 10 +
        (user.commentsCount || 0) * 5 +
        (user.likesCount || 0) * 5;

      let profileUpdatesCount = 0;
      let resumeUpdatesCount = 0;

      // ✅ Profile completion
      if (user.name && user.email && user.avatar && user.phone) {
        totalPoints += 15;
        profileUpdatesCount = 1;
      }

      // ✅ Resume completion
      if (
        (user.skills && user.skills.length > 0) ||
        (user.work && user.work.length > 0) ||
        (user.education && user.education.length > 0) ||
        (user.projects && user.projects.length > 0) ||
        (user.certificates && user.certificates.length > 0)
      ) {
        totalPoints += 15;
        resumeUpdatesCount = 1;
      }

      // ✅ Save updates
      user.profileUpdatesCount = profileUpdatesCount;
      user.resumeUpdatesCount = resumeUpdatesCount;
      user.totalPointsCount = totalPoints;
      await user.save();

      updatedUsers.push({
        id: user._id,
        postsCount: user.postsCount,
        commentsCount: user.commentsCount,
        likesCount: user.likesCount,
        profileUpdatesCount,
        resumeUpdatesCount,
        totalPointsCount: totalPoints,
      });
    }

    res.json({
      message: "Points synced successfully for all users",
      usersUpdated: updatedUsers.length,
      data: updatedUsers,
    });
  } catch (error) {
    console.error("Error syncing points:", error.message);
    res.status(500).json({ error: "Failed to sync points" });
  }
});

export default router;