import { User } from '../models/index.js';

export const list = async (req, res) =>
  res.json(await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'createdAt'], order: [['id', 'DESC']] }));
export const updateRole = async (req, res) => {
  if (!['student', 'teacher', 'admin'].includes(req.body.role)) return res.status(400).json({ error: 'Invalid role.' });
  await User.update({ role: req.body.role }, { where: { id: req.params.id } }); res.json({ ok: true });
};
export const remove = async (req, res) => { await User.destroy({ where: { id: req.params.id } }); res.json({ ok: true }); };
