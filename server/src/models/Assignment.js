import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
const Assignment = sequelize.define('Assignment', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  dueDate: DataTypes.DATEONLY,
}, { tableName: 'assignments' });
export default Assignment;
