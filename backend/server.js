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

// Upload an image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  res.json({
    success: true,
    file: req.file,
    imageUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/api/image/${req.file.filename}`,
  });
});

// Serve an image by filename
app.get('/api/image/:filename', async (req, res) => {
  try {
    const file = await conn.db.collection('uploads.files').findOne({ filename: req.params.filename });
    if (!file) return res.status(404).json({ error: 'No file found' });
    if (!file.contentType.startsWith('image/')) {
      return res.status(400).json({ error: 'File is not an image' });
    }

    const downloadStream = gfsBucket.openDownloadStreamByName(req.params.filename);
    downloadStream.on('error', (err) => {
      console.error('Error streaming image:', err);
      res.status(500).json({ error: 'Error streaming image' });
    });

    res.set('Content-Type', file.contentType);
    downloadStream.pipe(res);
  } catch (err) {
    console.error('Error retrieving image:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===================================================================
// 🌐 Other API Routes
// ===================================================================

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import companyRoutes from './routes/companies.js';
import otpRoutes from './routes/otp.js';

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);  // Auth/login/signup
app.use('/api/auth', otpRoutes);   // OTP verification
app.use('/api/companies', companyRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// ===================================================================
// 🚀 Start Server
// ===================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
