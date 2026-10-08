import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student', 'teacher', 'admin'), defaultValue: 'student' },
}, { tableName: 'users' });
export default User;
