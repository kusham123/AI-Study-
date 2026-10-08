import { Assignment, User } from '../models/index.js';

export const list = async (req, res) =>
  res.json(await Assignment.findAll({ include: [{ model: User, as: 'teacher', attributes: ['name'] }], order: [['dueDate', 'ASC']] }));
export const create = async (req, res) => res.json(await Assignment.create({ ...req.body, teacherId: req.user.id }));
export const remove = async (req, res) => {
  const where = { id: req.params.id, ...(req.user.role === 'admin' ? {} : { teacherId: req.user.id }) };
  await Assignment.destroy({ where }); res.json({ ok: true });
};
