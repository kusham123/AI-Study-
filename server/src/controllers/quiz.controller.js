import { Quiz } from '../models/index.js';
import { json } from '../services/openai.service.js';

export const list = async (req, res) => res.json(await Quiz.findAll({ where: { userId: req.user.id }, order: [['id', 'DESC']] }));
export const generate = async (req, res) => {
  const n = Math.min(Number(req.body.count) || 5, 10);
  const d = await json('You write quizzes. Return {"questions":[{"q":string,"options":[4 strings],"answer":index 0-3,"explain":string}]}.', `Create ${n} multiple-choice questions on: ${req.body.topic}`);
  res.json(await Quiz.create({ userId: req.user.id, topic: req.body.topic, questions: d.questions }));
};
export const remove = async (req, res) => { await Quiz.destroy({ where: { id: req.params.id, userId: req.user.id } }); res.json({ ok: true }); };
