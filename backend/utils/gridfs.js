// utils/gridfs.js
import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import { GridFSBucket } from "mongodb";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

// === Connect Mongoose ===
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const conn = mongoose.connection;

// === GridFS Bucket ===
let gfsBucket;
conn.once("open", () => {
  gfsBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
  console.log("✅ MongoDB connected & GridFSBucket initialized");
});

// === Multer + GridFS Storage ===
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString("hex") + path.extname(file.originalname);
        resolve({
          filename,
          bucketName: "uploads",
        });
      });
    });
  },
});

const upload = multer({ storage });

export { conn, gfsBucket, upload };
