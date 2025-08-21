import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = "https://api.straico.com/v1/prompt/completion";
const API_KEY = process.env.API_KEY;

function generatePrompt(resumeText) {
    return `
You are an expert AI resume reviewer.
Your job is to deeply scrutinize the given resume and provide a structured and comprehensive review as an HR expert would.
---
🎯 **Your Tasks:**
1. **Review each section in detail**:
   - Check for measurable impact statements, grammar quality, and ATS readability under "Content Quality"
   - Check presence and clarity of Education, Experience, and Contact Info under "Resume Structure"
   - Check design elements, format suitability, professional email presence, and proper hyperlink handling under "ATS Essentials"
2. **Give a score (0-100)** for each main section:
   - content_quality
   - resume_structure
   - ats_essentials
3. **Also provide ONE overall score (0–100)** that reflects total resume effectiveness and alignment with best practices.
4. **For each main section**, provide:
   - Sub-point evaluations (true/false) with JSON-friendly boolean values
   - A **detailed recruiter-style review in 4-5 lines** — not a generic tip, but an accurate, expert-level evaluation
5. **For the final section**, give a highly detailed "overall" analysis (5–6 lines) that:
   - Summarizes strengths and weaknesses
   - Suggests improvements in clarity, layout, ATS success, and professional impact
---
📦 **Expected JSON Output**:
{
  "candidate_name": "Extracted full name from the resume",
  "scores": {
    "content_quality": 0-100,
    "resume_structure": 0-100,
    "ats_essentials": 0-100,
    "overall_score": 0-100
  },
  "subpoints": {
    "content_quality": {
      "impact_statements": true/false,
      "grammar": true/false,
      "ats_readability": true/false
    },
    "resume_structure": {
      "education": true/false,
      "experience": true/false,
      "contact_info": true/false
    },
    "ats_essentials": {
      "format": true/false,
      "design": true/false,
      "email": true/false,
      "hyperlinks": true/false
    }
  },
  "suggestions": {
    "content_quality": "Detailed review for content quality (4-5 lines)",
    "resume_structure": "Detailed review for structure (4-5 lines)",
    "ats_essentials": "Detailed review for ATS essentials (4-5 lines)",
    "overall": "Very detailed final summary (5-6 lines)"
  }
}
---
📄 Resume to Review:
${resumeText.substring(0, 5000)}
`.trim();
}

export const analyzeResumeWithLLM = async (resumeText) => {
    const prompt = generatePrompt(resumeText);
    
    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    };
    
    const payload = {
        models: ["openai/gpt-4"],
        message: prompt
    };
    
    try {
        const response = await axios.post(API_URL, payload, { headers });
        const content = response.data.data.completions["openai/gpt-4"].completion.choices[0].message.content;
        
        // Extract JSON from response
        const match = content.trim().match(/{[\s\S]+}/);
        const parsed = match ? JSON.parse(match[0]) : {};
        
        return parsed;
    } catch (error) {
        console.error('❌ LLM Error:', error);
        return {};
    }
}
