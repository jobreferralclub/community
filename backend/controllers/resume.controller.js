import fs from "fs";
import pdfParser from "pdf-parser";
import { getLLMResponse } from "../utils/llm.js";
import { jsonrepair } from "jsonrepair";
import path from "path";
import mammoth from "mammoth";
import { extractTextAndEmail } from "../utils/parser.js";
import { scoreResumeWithLLM } from "../utils/scoring.js";
import { analyzeResumeWithLLM } from "../utils/resumeAnalyzer.js";

// --- JD ANALYZE ---
export const jdAnalyze = async (req, res) => {
    const { resume, jobDescription } = req.body;

    try {
        const prompt = `
You are a resume-job description analyzer.
Compare the given RESUME and JOB DESCRIPTION.
Return a JSON object strictly in the following format (no extra text, no explanation):

{
  "matchScore": number (0-100),
  "suggestions": [ "Suggestion1", "Suggestion2", ... ]
}

RESUME:
${JSON.stringify(resume, null, 2)}

JOB DESCRIPTION:
${jobDescription}
    `.trim();

        const llmResponse = await getLLMResponse(prompt);

        let parsed;
        try {
            parsed = JSON.parse(llmResponse);
        } catch (err) {
            console.error("❌ Failed to parse LLM response:", llmResponse);
            return res.status(500).json({ error: "Invalid LLM response" });
        }

        res.json(parsed);
    } catch (err) {
        console.error("❌ JD Analyze Error:", err.message);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// --- PDF TEXT EXTRACTION ---
export const extractText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const ext = path.extname(req.file.originalname).toLowerCase();
        console.log(req.file.originalname, ext)

        if (ext === ".pdf") {
            // ✅ Handle PDF
            pdfParser.pdf2json(req.file.path, (error, pdf) => {
                if (error) {
                    console.error("❌ pdf-parser error:", error);
                    return res.status(500).json({ error: "Failed to parse PDF" });
                }

                // Flatten the text content from all pages
                let extractedText = "";
                pdf.pages.forEach((page) => {
                    const pageText = page.texts.map((t) => t.text).join(" ");
                    extractedText += pageText + "\n";
                });

                // cleanup temp file
                fs.unlinkSync(req.file.path);

                res.json({
                    text: extractedText.trim(),
                    numpages: pdf.pages.length,
                    raw: pdf, // optional: send the full JSON structure if you want layout info
                });
            });

        } else if (ext === ".docx") {
            // ✅ Handle DOCX with mammoth
            const { value } = await mammoth.extractRawText({ path: req.file.path });
            res.json({
                text: value.trim(),
                numpages: null,
                raw: value, // optional: send the full JSON structure if you want layout info
            });

        } else {
            // ❌ Unsupported
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: "Unsupported file type. Only PDF and DOCX are allowed." });
        }
    } catch (err) {
        console.error("❌ ExtractText Error:", err.message);
        res.status(500).json({ error: "Something went wrong while extracting PDF" });
    }
};

// --- ENHANCE RESUME ---
export const enhanceResume = async (req, res) => {
    const { resumeText } = req.body;

    if (!resumeText || typeof resumeText !== "string")
        return res.status(400).json({ error: "Invalid or missing resumeText." });

    if (resumeText.length > 15000)
        return res
            .status(400)
            .json({ error: "Resume too long. Limit to 15,000 characters." });

    const trimmedResume = resumeText.slice(0, 3000);
    const prompt = `
You are an AI resume enhancement expert.
Enhance the following resume content by improving grammar, clarity, and impact, without changing the meaning.
Do NOT invent or add fictional information.

Only return valid, enhanced JSON matching this exact structure:

{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string",
    "summary": "string"
  },
  "experience": [...],
  "education": [...],
  "skills": [...],
  "projects": [...]
}

⚠️ Do not include commentary or markdown. Only return clean JSON.
Here is the resume text:
${trimmedResume}`;

    try {
        const llmResponse = await getLLMResponse(prompt);
        const cleaned = llmResponse.trim().replace(/```json|```/g, "");
        const repairedJson = jsonrepair(cleaned);
        const parsed = JSON.parse(repairedJson);

        return res.json(parsed);
    } catch (err) {
        console.error("❌ EnhanceResume Error:", err.message);
        res
            .status(500)
            .json({ error: "Failed to enhance resume using LLM." });
    }
};

// --- FORMAT PDF ---
export const formatPdf = async (req, res) => {
    const { resumeText } = req.body;

    if (!resumeText || typeof resumeText !== "string")
        return res.status(400).json({ error: "Invalid or missing resumeText." });

    if (resumeText.length > 15000)
        return res.status(400).json({ error: "Resume too long. Limit to 15,000 characters." });

    const trimmedResume = resumeText.slice(0, 3000);

    const prompt = `
You are a resume parsing expert.
Without changing any content, convert the following resume text into valid structured JSON.

{
  "personalInfo": {...},
  "experience": [...],
  "education": [...],
  "skills": [...],
  "projects": [...]
}

⚠️ Do not include commentary or markdown.
Resume text:
${trimmedResume}`;

    try {
        const llmResponse = await getLLMResponse(prompt);
        const cleaned = llmResponse.trim().replace(/```json|```/g, "");
        const repairedJson = jsonrepair(cleaned);
        const parsed = JSON.parse(repairedJson);

        return res.json(parsed);
    } catch (err) {
        console.error("❌ FormatPdf Error:", err.message);
        res.status(500).json({ error: "Failed to format resume using LLM." });
    }
};

export const resumeRanker = async (req, res) => {
    const {
        jd_text = "",
        tech_skills = "",
        soft_skills = "",
        top_n,
        weight_skills = 0,
        weight_experience = 0,
        weight_education = 0,
        weight_projects = 0,
        weight_achievements = 0,
    } = req.body;

    if (!jd_text || !req.files || req.files.length === 0)
        return res.status(400).json({ error: "Job description or resume files missing" });

    try {
        const techList = tech_skills.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
        const softList = soft_skills.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
        const customWeights = {
            skills: parseFloat(weight_skills),
            experience: parseFloat(weight_experience),
            education: parseFloat(weight_education),
            projects: parseFloat(weight_projects),
            achievements: parseFloat(weight_achievements),
        };

        const results = [];

        for (const file of req.files) {
            const parsed = await extractTextAndEmail(file);
            const score = await scoreResumeWithLLM({
                resumeText: parsed.text,
                jdText: jd_text,
                apiKey: process.env.API_KEY,
                techSkills: techList,
                softSkills: softList,
                customWeights,
            });

            results.push({ ...score, file_name: parsed.file_name, email: parsed.email });
        }

        results.sort((a, b) => (b.final_score || 0) - (a.final_score || 0));
        const topResults = top_n ? results.slice(0, parseInt(top_n)) : results;

        res.json({ results: topResults, tech_skills: techList, soft_skills: softList });
    } catch (err) {
        console.error("Ranking error:", err);
        res.status(500).json({ error: err.message, trace: err.stack });
    }
}

const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
function allowedFile(filename) {
  return ALLOWED_EXTENSIONS.includes(path.extname(filename).toLowerCase());
}

export const resumeAnalyzer = async (req, res) => {
    const file = req.file;
    console.log(req.file.path);
    if (!file || !allowedFile(req.file.originalname))
        return res.status(400).json({ success: false, error: "Invalid file format" });

    try {
        const resumeText = await extractTextAndEmail(req.file);
        console.log(resumeText.text);
        const result = await analyzeResumeWithLLM(resumeText.text);
        fs.unlinkSync(req.file.path);

        res.json({ success: true, data: result });
    } catch (err) {
        console.error("Analyze error:", err);
        res.status(500).json({ success: false, error: "Error during resume analysis" });
    }
}