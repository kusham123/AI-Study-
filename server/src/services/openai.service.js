import OpenAI from 'openai';

// Works with any OpenAI-compatible provider (OpenAI, Gemini, Groq, OpenRouter, Ollama).
// Change only the .env values: AI_API_KEY, AI_BASE_URL, AI_MODEL.
const client = new OpenAI({
  apiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_BASE_URL || undefined,
});
const model = process.env.AI_MODEL  || 'gemini-2.5-flash';

const run = async (system, user) => {
  try {
    const r = await client.chat.completions.create({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] });
    return r.choices[0].message.content;
  } catch (e) { console.error(`[AI error] status=${e.status ?? 'none'} model=${model} base=${process.env.AI_BASE_URL || 'openai default'} -> ${e.message}`); e.userMessage = 'The AI request failed. Check AI_API_KEY, AI_BASE_URL and AI_MODEL in .env.'; throw e; }
};
export const chat = (system, user) => run(system, user);
export const json = async (system, user) => {
  const text = await run(system + ' Respond with valid JSON only, no markdown fences.', user);
  return JSON.parse(text.replace(/```json|```/g, '').trim());
};
