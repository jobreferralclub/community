import { getLLMResponse } from "../utils/llm.js";

export const giveJoke = async (req, res) => {
    const prompt = `
You are a funny AI comedian.
Tell me one clean, short, and witty random joke.
Return only the joke text.
`.trim();

    const joke = await getLLMResponse(prompt);
    res.json({ joke });
};