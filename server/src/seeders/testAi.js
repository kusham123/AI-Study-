// Run: npm run test:ai  -> checks your .env AI settings and prints the real error
import 'dotenv/config';
import OpenAI from 'openai';

const key = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
const baseURL = process.env.AI_BASE_URL || undefined;
const model = process.env.AI_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';
console.log({ keyLoaded: !!key, keyStart: key?.slice(0, 6), keyLength: key?.length, baseURL, model });
if (!key || key.includes('your_')) { console.log('\nFix: AI_API_KEY is missing or still the placeholder in server/.env'); process.exit(1); }

try {
  const r = await new OpenAI({ apiKey: key, baseURL }).chat.completions.create({ model, messages: [{ role: 'user', content: 'Say OK' }] });
  console.log('\nSUCCESS:', r.choices[0].message.content);
} catch (e) {
  console.log('\nFAILED  status:', e.status, '\n', e.message);
  const hints = { 400: 'Bad request: check AI_MODEL name or AI_BASE_URL.', 401: 'Key invalid: recreate the key and paste again.', 403: 'Key not allowed: check API is enabled / region.', 404: 'Wrong AI_MODEL or AI_BASE_URL.', 429: 'Quota/rate limit reached or no credit. Wait, or use another model/key.' };
  console.log('Hint:', hints[e.status] || 'Check internet connection and AI_BASE_URL.');
}
