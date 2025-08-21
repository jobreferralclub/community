// utils/llm.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = "https://api.straico.com/v1/prompt/completion";
const API_KEY = process.env.API_KEY;

/**
 * Sends a prompt to the LLM and returns the completion.
 * @param {string} prompt - The text prompt to send to the LLM.
 * @param {string[]} models - Optional: list of models to use. Defaults to ["openai/gpt-4"].
 * @returns {Promise<string>} - LLM response text
 */
export async function getLLMResponse(prompt, models = ["openai/gpt-4"]) {
    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    };

    const payload = {
        models,
        message: prompt
    };

    try {
        const response = await axios.post(API_URL, payload, { headers });
        const content = response.data.data.completions[models[0]].completion.choices[0].message.content;
        return content.trim();
    } catch (error) {
        console.error('❌ LLM Error:', error.response?.data || error.message);
        return "Oops! Couldn't fetch a response from LLM right now.";
    }
}
