// routes/roles.js
import express from "express";
import { fetchOpenRoles } from "../utils/googleSheets.js";

const router = express.Router();

// GET /api/roles
router.get("/", async (req, res) => {
  try {
    const openRoles = await fetchOpenRoles();
    res.json({ openRoles });
  } catch (error) {
    console.error("Error fetching roles:", error.message);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
});

export default router;
