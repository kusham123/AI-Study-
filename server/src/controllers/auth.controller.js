import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const out = (u) => ({
  token: jwt.sign({ id: u.id, role: u.role, name: u.name }, process.env.JWT_SECRET, { expiresIn: '7d' }),
  user: { id: u.id, name: u.name, email: u.email, role: u.role },
});

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || password.length < 6) return res.status(400).json({ error: 'Enter name, email and a 6+ character password.' });
  if (await User.findOne({ where: { email } })) return res.status(409).json({ error: 'This email is already registered.' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role: role === 'teacher' ? 'teacher' : 'student' });
  res.json(out(user));
};
export const login = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ error: 'Email or password is incorrect.' });
  res.json(out(user));
};
