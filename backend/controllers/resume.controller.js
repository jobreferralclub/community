import fs from "fs";
import pdfParser from "pdf-parser";
import { getLLMResponse } from "../utils/llm.js";
import { jsonrepair } from "jsonrepair";
import path from "path";
import mammoth from "mammoth";
import puppeteer from "puppeteer";
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

export const generateResumePdf = async (req, res) => {
    const { html } = req.body;

    if (!html || typeof html !== "string") {
        return res.status(400).json({ error: "Invalid or missing HTML content." });
    }

    try {
        const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="resume.pdf"');
        res.end(pdfBuffer); // ✅ important
    } catch (error) {
        console.error("PDF generation error:", error.message);
        res.status(500).json({ error: "Failed to generate PDF." });
    }
};

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

// --- MOCK INTERVIEW ---

export const mockInterview = async (req, res) => {
    const { resume, jobDescription } = req.body;

    if (!resume || !jobDescription) {
        return res.status(400).json({ success: false, error: "Resume and Job Description are required" });
    }

    console.log("Resume and Job Description are required");

    try {
        const prompt = `
You are an expert interview question generator.
Given a candidate's RESUME and a JOB DESCRIPTION (both as plain text strings), generate 10 interview questions that are highly relevant.
Return strictly a JSON array of 10 strings (no extra text, no explanations).

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}
        `.trim();

        const llmResponse = await getLLMResponse(prompt);

        let questions;
        try {
            questions = JSON.parse(llmResponse);
        } catch (err) {
            console.error("❌ Failed to parse LLM response:", llmResponse);
            return res.status(500).json({ success: false, error: "Invalid LLM response" });
        }

        res.json({
            success: true,
            questions
        });
    } catch (err) {
        console.error("❌ Mock Interview Error:", err.message);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

export const analyzeInterview = async (req, res) => {
    const { questions, answers, jobDescription } = req.body;

    if (!questions || !answers || !jobDescription) {
        return res.status(400).json({ success: false, error: "Questions, Answers, and Job Description are required" });
    }

    try {
        const prompt = `
You are an expert technical interviewer and career coach.
Analyze the candidate's answers based on the given QUESTIONS and JOB DESCRIPTION.
Highlight strengths, weaknesses, and give constructive feedback.

Input:
JOB DESCRIPTION: ${jobDescription}

QUESTIONS & ANSWERS:
${questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "(no answer)"}`).join("\n\n")}

Return a JSON object with this exact structure:
{
  "overallScore": "string (e.g., 7.5/10)",
  "strengths": ["list of strengths"],
  "weaknesses": ["list of weaknesses"],
  "recommendations": ["list of improvement tips"],
  "summary": "short paragraph summarizing performance"
}
        `.trim();

        const llmResponse = await getLLMResponse(prompt);

        let report;
        try {
            report = JSON.parse(llmResponse);
        } catch (err) {
            console.error("❌ Failed to parse LLM response:", llmResponse);
            return res.status(500).json({ success: false, error: "Invalid LLM response" });
        }

        res.json({
            success: true,
            report
        });
    } catch (err) {
        console.error("❌ Analyze Interview Error:", err.message);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

// --- APPLICATION KIT ---
// Generate Application Kit (Cover Letter)
export const generateCoverLetter = async (req, res) => {
    try {
        const { jobDescription, resume, jobTitle, companyName } = req.body;

        if (!jobDescription || !resume || !jobTitle || !companyName) {
            return res
                .status(400)
                .json({ error: "Job title, company name, job description, and resume are required" });
        }

        // Prompt for LLM
        const prompt = `
You are an expert career coach.
Write a personalized cover letter in **HTML snippet** format for use inside a rich text editor.

Inputs:
- Job Title: ${jobTitle}
- Company Name: ${companyName}
- Job Description: ${jobDescription}
- Candidate Resume: ${JSON.stringify(resume, null, 2)}

⚠️ Very important:
- Do NOT include <html>, <head>, or <body> tags.
- Only return the cover letter content using <p>, <h2>, <strong>, <ul>, <li>, and <br> where appropriate.
- Keep formatting clean and professional.
        `.trim();

        // Call your existing LLM wrapper
        const htmlSnippet = await getLLMResponse(prompt);

        // Return JSON response
        res.status(200).json({
            jobTitle,
            companyName,
            coverLetter: htmlSnippet,
        });
    } catch (error) {
        console.error("❌ Error generating application kit:", error);
        res.status(500).json({ error: "Failed to generate application kit" });
    }
};

// --- GENERATE TAILORED RESUME ---
export const generateJDResume = async (req, res) => {
    try {
        const { masterResume, jobDescription, jobTitle, companyName } = req.body;

        if (!masterResume || !jobDescription || !jobTitle || !companyName) {
            return res.status(400).json({
                error: "Master resume, job description, job title, and company name are required"
            });
        }

        const prompt = `
You are an expert career coach and resume optimization specialist.
Given the MASTER RESUME (in JSON format) and the JOB DESCRIPTION,
generate a tailored resume optimized for this job.

⚠️ Very important:
- Only use existing information from the master resume.
- Reorder, highlight, or omit details to maximize relevance.
- Do NOT invent new experiences, education, or skills.

Return strictly valid JSON matching this exact structure:

{
  "name": "string",
  "email": "string",
  "phone": "string",
  "job_title": "string",
  "company": "string",
  "location": "string",
  "bio": "string",
  "education": [...],
  "work": [...],
  "projects": [...],
  "skills": [...],
  "certificates": [...]
}

MASTER RESUME:
${JSON.stringify(masterResume, null, 2)}

JOB TITLE: ${jobTitle}
COMPANY NAME: ${companyName}
JOB DESCRIPTION:
${jobDescription}
        `.trim();

        const llmResponse = await getLLMResponse(prompt);

        let tailoredResume;
        try {
            const cleaned = llmResponse.trim().replace(/```json|```/g, "");
            const repairedJson = jsonrepair(cleaned);
            tailoredResume = JSON.parse(repairedJson);
        } catch (err) {
            console.error("❌ Failed to parse tailored resume JSON:", llmResponse);
            return res.status(500).json({ error: "Invalid LLM response while generating resume" });
        }

        res.status(200).json({
            success: true,
            tailoredResume,
        });
    } catch (error) {
        console.error("❌ Error generating tailored resume:", error);
        res.status(500).json({ error: "Failed to generate tailored resume" });
    }
};