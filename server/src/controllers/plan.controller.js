import { StudyPlan } from '../models/index.js';
import { json } from '../services/openai.service.js';

export const list = async (req, res) => res.json(await StudyPlan.findAll({ where: { userId: req.user.id }, order: [['id', 'DESC']] }));
export const generate = async (req, res) => {
  const { goal, days = 7, hours = 2 } = req.body;
  const d = await json('You are a study coach. Return {"plan":[{"day":string,"focus":string,"tasks":[string],"hours":number}]}.', `Goal: ${goal}. Days available: ${days}. Hours per day: ${hours}.`);
  res.json(await StudyPlan.create({ userId: req.user.id, goal, plan: d.plan }));
};
export const remove = async (req, res) => { await StudyPlan.destroy({ where: { id: req.params.id, userId: req.user.id } }); res.json({ ok: true }); };
