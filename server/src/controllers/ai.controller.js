import { chat } from '../services/openai.service.js';
import { Note, Quiz } from '../models/index.js';

export const ask = async (req, res) =>
  res.json({ answer: await chat('You are a patient AI tutor. Explain step by step with simple examples. Keep answers concise.', req.body.question) });

export const summarize = async (req, res) =>
  res.json({ summary: await chat('Summarize the text into clear key points.', req.body.text) });

export const recommend = async (req, res) => {
  const opt = { where: { userId: req.user.id }, limit: 5, order: [['id', 'DESC']] };
  const [notes, quizzes] = await Promise.all([Note.findAll(opt), Quiz.findAll(opt)]);
  const topics = [...notes.map((n) => n.title), ...quizzes.map((q) => q.topic)].join(', ') || 'none yet';
  res.json({ recommendations: await chat('Suggest 4 next topics to learn with a one-line reason each, as a short bullet list.', `Recent topics: ${topics}`) });
};
