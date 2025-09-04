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
  console.log("Fetching gamification stats for userId:", userId);  // Log userId

  try {
    const user = await User.findById(userId).select("postsCount commentsCount likesCount profileUpdatesCount resumeUpdatesCount");
    console.log("User data fetched:", user);  // Log user response

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const totalPoints =
      (user.postsCount || 0) * 10 +
      (user.commentsCount || 0) * 5 +
      (user.likesCount || 0) * 5 +
      (user.profileUpdatesCount || 0) * 15 +
      (user.resumeUpdatesCount || 0) * 15;

    res.json({ ...user.toObject(), totalPoints });
  } catch (error) {
    console.error("Error fetching gamification stats:", error); // Detailed error log
    res.status(500).json({ error: "Failed to fetch gamification stats" });
  }
});



export default router;
