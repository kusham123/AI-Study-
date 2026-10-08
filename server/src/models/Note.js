import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
const Note = sequelize.define('Note', {
  title: { type: DataTypes.STRING, allowNull: false },
  content: DataTypes.TEXT('long'),
}, { tableName: 'notes' });
export default Note;
