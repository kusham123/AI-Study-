import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
const StudyPlan = sequelize.define('StudyPlan', {
  goal: { type: DataTypes.STRING, allowNull: false },
  plan: DataTypes.JSON,
}, { tableName: 'study_plans' });
export default StudyPlan;
