import express from "express";
import { createCommunity, deleteCommunity, getAllCommunities, getCommunityById, getPostsByCommunityId, syncCommunity, updateCommunity } from "../controllers/community.controller.js";

const router = express.Router();

router.get("/", getAllCommunities);
router.get("/:id", getCommunityById);
router.post("/", createCommunity);
router.put("/:id", updateCommunity);
router.delete("/:id", deleteCommunity);
router.get("/:id/posts", getPostsByCommunityId);



// 📌 Sync posts into their communities
router.post("/sync-posts", syncCommunity);

export default router;
