import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

// Create a blog
router.post("/", async (req, res) => {
    try {
        const { title, coverImage, shortDesc, content, authorName, authorImage } = req.body;

        if (!title || !content || !authorName) {
            return res.status(400).json({ message: "Title, content, and author name are required" });
        }

        const blog = new Blog({ title, coverImage, shortDesc, content, authorName, authorImage });
        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all blogs
router.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single blog by ID
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a blog by ID
router.put("/:id", async (req, res) => {
    try {
        const { title, coverImage, shortDesc, content, authorName, authorImage } = req.body;

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, coverImage, shortDesc, content, authorName, authorImage },
            { new: true }
        );

        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a blog by ID
router.delete("/:id", async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json({ message: "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
