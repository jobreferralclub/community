import axios from 'axios';

const STRAICO_API_URL = "https://api.straico.com/v1/prompt/completion";

function generatePrompt(jdText, resumeText, techSkills, softSkills, customWeights = null) {
    const techStr = techSkills.map(s => s.trim().toLowerCase()).join(', ');
    const softStr = softSkills.map(s => s.trim().toLowerCase()).join(', ');

    let weightPrompt = '';
    if (customWeights && Object.values(customWeights).some(v => v > 0.0)) {
        weightPrompt += '\n\n### Additional Section Weights:\n';
        for (const [section, value] of Object.entries(customWeights)) {
            if (value > 0.0) {
                weightPrompt += `- ${section.charAt(0).toUpperCase() + section.slice(1)}: ${value}\n`;
            }
        }
        weightPrompt += '- Give slightly more importance to sections with higher weights.\n';
    } else {
        weightPrompt += '\n\n### Use balanced default weighting across resume sections.\n';
    }

    return `
You are an expert AI recruiter assistant.
Your task is to evaluate a candidate's resume based on the following:

### Objective:
Evaluate the candidate's resume against the job description and calculate a **final score (0.0 - 1.0)**.

### Scoring Guidelines:
1. **Base Score:**  
   - Start by evaluating the overall alignment of the resume with the JD.
   - Consider roles, responsibilities, and requirements.

2. **Skill-based Improvement:**  
   - For each technical skill listed, if the candidate has it (explicitly or implied), increase the score slightly.
   - Do the same for soft skills.
   - Assign individual scores for each skill (0.0 to 1.0) based on strength and evidence.

3. **Custom Weights:**  
   - If custom section weights are provided, give additional scrutiny to these sections (skills, experience, education, projects, achievements).
   - Adjust the final score upward or downward slightly based on these weights.

4. **Location Penalty:**  
   - If the JD specifies a location and the candidate is in a different city or region, **slightly reduce** the final score.

5. **Final Score Adjustment:**  
   - Ensure the final score is between 0.0 and 1.0 after all adjustments.

### Output JSON (STRICT FORMAT):
{
  "candidate_name": "Full name or Unknown",
  "tech_skills_scores": {
    "skill_1": 0.0,
    "skill_2": 0.0
  },
  "soft_skills_scores": {
    "skill_1": 0.0,
    "skill_2": 0.0
  },
  "final_score": 0.0,
  "analysis": "Brief explanation of strengths, weaknesses, and final score reasoning."
}

### Technical Skills to Evaluate:
${techStr || 'None'}

### Soft Skills to Evaluate:
${softStr || 'None'}

${weightPrompt}

### Job Description:
${jdText}

### Resume:
${resumeText}
`.trim();
}

function safeJsonFromLLM(content) {
    try {
        return JSON.parse(content);
    } catch (error) {
        // Try to find JSON block in content
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}');
        
        if (start !== -1 && end !== -1 && end > start) {
            try {
                return JSON.parse(content.substring(start, end + 1));
            } catch (error) {
                // Continue to regex approach
            }
        }
        
        // Try regex to find JSON blocks
        const jsonMatches = content.match(/{[\s\S]*}/g);
        if (jsonMatches) {
            for (const block of jsonMatches) {
                try {
                    return JSON.parse(block);
                } catch (error) {
                    continue;
                }
            }
        }
        
        throw new Error('LLM response did not contain valid JSON.');
    }
}

export const scoreResumeWithLLM =  async  ({ resumeText, jdText, apiKey, techSkills, softSkills, customWeights = null }) => {
    const prompt = generatePrompt(jdText, resumeText, techSkills, softSkills, customWeights);
    
    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };
    
    const payload = {
        models: ["openai/gpt-4"],
        message: prompt
    };
    
    try {
        const response = await axios.post(STRAICO_API_URL, payload, { headers });
        const content = response.data.data.completions["openai/gpt-4"].completion.choices[0].message.content;
        
        const parsed = safeJsonFromLLM(content);
        
        console.log('🧠', parsed.candidate_name || 'Unknown', '→', parsed.final_score || 0.0, '—', parsed.analysis || '');
        
        return {
            candidate_name: parsed.candidate_name || 'Unknown',
            tech_skills_scores: parsed.tech_skills_scores || {},
            soft_skills_scores: parsed.soft_skills_scores || {},
            final_score: Math.round((parsed.final_score || 0.0) * 100) / 100,
            analysis: parsed.analysis || ''
        };
    } catch (error) {
        console.error('❌ LLM Error:', error);
        return {
            candidate_name: 'Unknown',
            tech_skills_scores: {},
            soft_skills_scores: {},
            final_score: 0.0,
            analysis: 'LLM failed to respond'
        };
    }
}