import { Note } from '../models/index.js';
import { chat } from '../services/openai.service.js';

export const list = async (req, res) => res.json(await Note.findAll({ where: { userId: req.user.id }, order: [['id', 'DESC']] }));
export const generate = async (req, res) => {
  const { topic } = req.body;
  const content = await chat('Create well-structured study notes in Markdown: headings, bullet points, key terms, and a short recap.', `Topic or material: ${topic}`);
  res.json(await Note.create({ userId: req.user.id, title: topic.slice(0, 80), content }));
};
export const remove = async (req, res) => { await Note.destroy({ where: { id: req.params.id, userId: req.user.id } }); res.json({ ok: true }); };
