const { buildSystemPrompt } = require("../prompts/systemPrompt");
const ApiError = require("../utils/ApiError");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function getConfig() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new ApiError(500, "AI service is not configured");
    }
    return {
        apiKey,
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
        maxTokens: parseInt(process.env.AI_MAX_TOKENS, 10) || 300,
    };
}

async function chatWithAI(message, history = []) {
    const config = getConfig();

    const messages = [
        { role: "system", content: buildSystemPrompt() },
        ...history,
        { role: "user", content: message },
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
        const res = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify({
                model: config.model,
                messages,
                temperature: config.temperature,
                max_tokens: config.maxTokens,
            }),
            signal: controller.signal,
        });

        if (!res.ok) {
            if (res.status === 429) {
                throw new ApiError(429, "AI service is temporarily busy. Please try again.");
            }
            if (res.status === 401) {
                throw new ApiError(500, "AI service authentication failed.");
            }
            throw new ApiError(502, "AI service is currently unavailable.");
        }

        const data = await res.json();
        return data.choices[0].message.content;
    } catch (err) {
        if (err.name === "AbortError") {
            throw new ApiError(504, "AI request timed out. Please try again.");
        }
        if (err instanceof ApiError) throw err;
        throw new ApiError(502, "AI service is currently unavailable.");
    } finally {
        clearTimeout(timeout);
    }
}

module.exports = { chatWithAI }
