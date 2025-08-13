import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import path from 'path';
import crypto from 'crypto';
import { GridFSBucket } from 'mongodb';

// Import routes
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import companyRoutes from './routes/companies.js';
import otpRoutes from './routes/otp.js';

// Initialize env variables
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
const mongoURI = process.env.MONGO_URI;

// Connect mongoose
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const conn = mongoose.connection;

// Initialize GridFS Bucket variable
let gfsBucket;

conn.once('open', () => {
  gfsBucket = new GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
  console.log('MongoDB connected and GridFSBucket set up');
});

// Multer + GridFS storage setup
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads' // Match collection name
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

// === Image Upload Endpoint ===
// POST /api/upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({
    success: true,
    file: req.file,
    imageUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/api/image/${req.file.filename}`
  });
});

// === Serve Image Endpoint ===
// GET /api/image/:filename
app.get('/api/image/:filename', async (req, res) => {
  try {
    const file = await conn.db.collection('uploads.files').findOne({ filename: req.params.filename });
    if (!file || file.length === 0) {
      return res.status(404).json({ error: 'No file found' });
    }

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

// === Existing API Routes ===
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);       // Auth/login/signup routes
app.use('/api/auth', otpRoutes);        // OTP verification routes
app.use('/api/companies', companyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: "ok" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
