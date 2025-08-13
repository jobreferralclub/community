import express from 'express';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import Grid from 'gridfs-stream';
import crypto from 'crypto';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const mongoURI = process.env.MONGO_URI;

// Mongo Connection for GridFS
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Storage Engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString('hex') + path.extname(file.originalname);
        resolve({ filename, bucketName: 'uploads' });
      });
    });
  }
});
const upload = multer({ storage });

// Upload Image
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({
    success: true,
    file: req.file,
    imageUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/api/upload/${req.file.filename}`
  });
});

// Serve Image
router.get('/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) return res.status(404).json({ error: 'No file found' });
    if (file.contentType.startsWith('image/')) {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(400).json({ error: 'Not an image' });
    }
  });
});

export default router;
