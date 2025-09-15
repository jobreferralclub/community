import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

/**
 * GET /api/search?q=keyword
 */
router.get("/", async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    try {
        const regex = new RegExp(q, "i");

        // Posts (check title, content, author name, and community)
        const postsRaw = await Post.find({
            $or: [
                { title: { $regex: regex } },
                { content: { $regex: regex } },
                { community: { $regex: regex } }
            ]
        })
            .sort({ createdAt: -1 })   // ✅ sort by newest first
            .limit(30)                 // fetch extra before filtering
            .populate("createdBy", "name avatar");

        const posts = postsRaw
            .filter(
                (p) =>
                    regex.test(p.title || "") ||
                    regex.test(p.content || "") ||
                    regex.test(p.community || "") ||
                    regex.test(p.createdBy?.name || "")
            )
            .slice(0, 10); // return max 10 results

        const results = posts.map((p) => ({
            id: p._id,
            type: "post",
            name: p.title,
            snippet: p.content?.replace(/<[^>]+>/g, "").slice(0, 120), // strip HTML
            community: p.community,
            author: {
                id: p.createdBy?._id,
                name: p.createdBy?.name,
                avatar: p.createdBy?.avatar,
            },
            url: `/posts/${p._id}`,
        }));

        res.json({ results });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
