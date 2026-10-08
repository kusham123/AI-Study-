import { sequelize } from '../config/db.js';
import User from './User.js';
import Note from './Note.js';
import Quiz from './Quiz.js';
import StudyPlan from './StudyPlan.js';
import Assignment from './Assignment.js';

for (const M of [Note, Quiz, StudyPlan]) {
  User.hasMany(M, { foreignKey: 'userId', onDelete: 'CASCADE' });
  M.belongsTo(User, { foreignKey: 'userId' });
}
User.hasMany(Assignment, { foreignKey: 'teacherId', onDelete: 'CASCADE' });
Assignment.belongsTo(User, { as: 'teacher', foreignKey: 'teacherId' });

export { sequelize, User, Note, Quiz, StudyPlan, Assignment };
