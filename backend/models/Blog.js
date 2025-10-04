import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    coverImage: { type: String }, // Base64 or URL
    shortDesc: { type: String },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    authorName: { type: String, required: true }, // Author's name
    authorImage: { type: String }, // URL or Base64 for author profile image
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
