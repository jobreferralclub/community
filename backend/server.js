// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { generatePostsAll } from './controllers/google-sheet-referral-bot/fetchPosts.js';

// === Load Environment Variables ===
dotenv.config();

// === Fix __dirname for ES modules ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Initialize Express App ===
const app = express();

// === Middleware ===
app.use(cors());
app.use(express.json());

// ===================================================================
// 🌐 API Routes
// ===================================================================
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import companyRoutes from "./routes/companies.js";
import otpRoutes from "./routes/otp.js";
import uploadRoutes from "./routes/upload.js";
import analyticsRoutes from "./routes/analytics.js";
import rolesStatsRoutes from "./routes/rolesStats.js";
import resumeRoutes from "./routes/resume.js";
import communityRoutes from  "./routes/community.js";
import { giveJoke } from "./controllers/give-joke.controller.js";


// Community
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/communities", communityRoutes);

// Login/Signup
app.use("/api/auth", authRoutes);
app.use("/api/auth", otpRoutes);

// Resume and JD analysis
app.use("/api/resume", resumeRoutes);

// Landing page
app.use("/api/roleStats", rolesStatsRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Check if llm works or not
app.get('/api/give-joke', giveJoke);

//Fetching Job Posts from Google sheet

setInterval(() => {
  generatePostsAll()
    .then(() => console.log('Job posts generation completed'))
    .catch(err => console.error('Error generating job posts:', err));
}, 10 * 60 * 1000); // 10 minutes interval


// ===================================================================
// 🚀 Start Server
// ===================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
