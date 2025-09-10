// routes/resume.js
import express from "express";
import multer from "multer";
import { jdAnalyze, extractText, enhanceResume, formatPdf, resumeRanker, resumeAnalyzer, mockInterview, analyzeInterview, generateCoverLetter, generateJDResume, generateResumePdf } from "../controllers/resume.controller.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("resume"), resumeAnalyzer);
router.post("/rank", upload.array("resumes"), resumeRanker);
router.post("/format-pdf", formatPdf);
router.post("/extract-text", upload.single("resume"), extractText);
router.post("/enhance-resume", enhanceResume);
router.post("/jd-analyze", jdAnalyze);
router.post("/mock-interview", mockInterview);
router.post("/analyze-interview", analyzeInterview);
router.post("/generate-cover-letter", generateCoverLetter);
router.post("/generate-jd-resume", generateJDResume);
router.post("/generate-resume-pdf", generateResumePdf);

export default router;
