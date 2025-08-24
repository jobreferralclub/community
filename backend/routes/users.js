import express from "express";
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

export default router;
