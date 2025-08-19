import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
const router = express.Router();
import { conn, gfsBucket, upload } from "../utils/gridfs.js";

// Upload an image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  res.json({
    success: true,
    file: req.file,
    imageUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/api/image/${req.file.filename}`,
  });
});

// Serve an image by filename
router.get('/image/:filename', async (req, res) => {
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

// Export the router to be used in server.js
export default router;