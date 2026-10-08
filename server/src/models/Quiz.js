import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
const Quiz = sequelize.define('Quiz', {
  topic: { type: DataTypes.STRING, allowNull: false },
  questions: DataTypes.JSON,
}, { tableName: 'quizzes' });
export default Quiz;
