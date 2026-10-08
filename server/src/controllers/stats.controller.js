import { Note, Quiz, StudyPlan, Assignment } from '../models/index.js';

export const stats = async (req, res) => {
  const where = { where: { userId: req.user.id } };
  const [notes, quizzes, plans, assignments] = await Promise.all([Note.count(where), Quiz.count(where), StudyPlan.count(where), Assignment.count()]);
  res.json({ notes, quizzes, plans, assignments });
};
