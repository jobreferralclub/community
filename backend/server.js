// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { conn, gfsBucket, upload } from "./utils/gridfs.js";

// === Load Environment Variables ===
dotenv.config();

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

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // Auth/login/signup
app.use("/api/auth", otpRoutes);  // OTP verification
app.use("/api/companies", companyRoutes);
app.use("/api", uploadRoutes); // Image upload routes

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// ===================================================================
// 🚀 Start Server
// ===================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
