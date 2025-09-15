import Community from "../models/Community.js";
import Post from "../models/Post.js";
// import redis from "../utils/redisClient.js";

export const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find().select("-posts");

        res.json(communities);
    } catch (error) {
        console.error("Error fetching communities:", error);
        res.status(500).json({ error: "Failed to fetch communities" });
    }
};

export const getCommunityById = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id)
            .populate({
                path: "posts.postId",
                populate: { path: "createdBy", select: "name avatar" },
            });

        if (!community) {
            return res.status(404).json({ error: "Community not found" });
        }

        res.json(community);
    } catch (error) {
        console.error("Error fetching community:", error);
        res.status(500).json({ error: "Failed to fetch community" });
    }
};

export const createCommunity = async (req, res) => {
    try {
        const { name, description, route } = req.body;

        const community = new Community({ name, description, posts: [], route });
        await community.save();

        res.status(201).json(community);
    } catch (error) {
        console.error("Error creating community:", error);
        res.status(500).json({ error: "Failed to create community" });
    }
};

export const updateCommunity = async (req, res) => {
    try {
        const { name, description } = req.body;

        const community = await Community.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!community) {
            return res.status(404).json({ error: "Community not found" });
        }

        res.json(community);
    } catch (error) {
        console.error("Error updating community:", error);
        res.status(500).json({ error: "Failed to update community" });
    }
};

export const deleteCommunity = async (req, res) => {
    try {
        const community = await Community.findByIdAndDelete(req.params.id);

        if (!community) {
            return res.status(404).json({ error: "Community not found" });
        }

        res.json({ message: "Community deleted successfully" });
    } catch (error) {
        console.error("Error deleting community:", error);
        res.status(500).json({ error: "Failed to delete community" });
    }
};

export const getPostsByCommunityId = async (req, res) => {
    try {
        const { page = 1 } = req.query; // ✅ read from query, not body
        const limit = 10;
        const skip = (page - 1) * limit;

        // 1. Check if community exists
        const community = await Community.findById(req.params.id).lean();
        if (!community) {
            return res.status(404).json({ error: "Community not found" });
        }

        // 2. Get total posts from community.postCount (already stored)
        const totalPosts = community.postCount || 0;
        const totalPages = Math.ceil(totalPosts / limit);

        // 3. Fetch posts directly from Post collection
        const posts = await Post.find({ community: community.name }) // assuming Post has `community` field
            .sort({ createdAt: -1 }) // newest first
            .skip(skip)
            .limit(limit)
            .select("-job_description") // exclude heavy field
            .populate("createdBy", "name avatar") // author details
            .lean();

        res.json({
            community: {
                _id: community._id,
                name: community.name,
                description: community.description,
                route: community.route,
                postCount: totalPosts,
            },
            totalPages,
            currentPage: Number(page), // ✅ convert string to number
            totalPosts,
            posts,
        });
    } catch (error) {
        console.error("Error fetching community posts:", error);
        res.status(500).json({ error: "Failed to fetch community posts" });
    }
};

export const syncCommunity = async (req, res) => {
    try {
        // Fetch all communities
        const communities = await Community.find();

        let updatedCommunities = [];

        for (const community of communities) {
            // Update postCount = number of posts in the community
            const newCount = community.posts.length;

            if (community.postCount !== newCount) {
                community.postCount = newCount;
                await community.save();
                updatedCommunities.push({
                    name: community.name,
                    postCount: community.postCount,
                });
            }
        }

        res.json({
            message: "Community post counts synced successfully",
            updatedCommunities,
        });
    } catch (error) {
        console.error("Error syncing community post counts:", error);
        res.status(500).json({ error: "Failed to sync community post counts" });
    }
};
