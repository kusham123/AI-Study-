// Usage:  npm run seed          -> create database + tables (safe, keeps data), add demo data
//         npm run seed:fresh    -> DROP all tables, recreate, add demo data
import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const fresh = process.argv.includes('--fresh');
const { DB_HOST, DB_PORT = 3306, DB_USER, DB_PASS, DB_NAME } = process.env;

// 1. create the database if it does not exist
const conn = await mysql.createConnection({ host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASS });
await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
await conn.end();

// 2. create tables from the models
const { sequelize, User, Note, Quiz, StudyPlan, Assignment } = await import('../models/index.js');
await sequelize.sync(fresh ? { force: true } : { alter: true });
console.log(`Tables ${fresh ? 'recreated' : 'synced'}: ${Object.keys(sequelize.models).join(', ')}`);

// 3. seed users
const hash = (p) => bcrypt.hash(p, 10);
const mkUser = async (name, email, password, role) =>
  (await User.findOrCreate({ where: { email }, defaults: { name, email, password: await hash(password), role } }))[0];

const admin = await mkUser('Admin', process.env.ADMIN_EMAIL || 'admin@aistudy.com', process.env.ADMIN_PASSWORD || 'Admin@123', 'admin');
const teacher = await mkUser('Riya Sharma', 'teacher@aistudy.com', 'Teacher@123', 'teacher');
const student = await mkUser('Aman Verma', 'student@aistudy.com', 'Student@123', 'student');

// 4. seed sample content (only when empty)
if (!(await Assignment.count())) {
  await Assignment.bulkCreate([
    { title: 'Intro to Algorithms – Problem Set 1', description: 'Solve the 5 sorting problems and write the time complexity of each.', dueDate: '2026-11-15', teacherId: teacher.id },
    { title: 'Photosynthesis Short Essay', description: 'Write 300 words on light and dark reactions.', dueDate: '2026-11-20', teacherId: teacher.id },
  ]);
}
if (!(await Note.count({ where: { userId: student.id } })))
  await Note.create({ userId: student.id, title: 'Binary Search', content: '## Binary Search\n- Works on **sorted** arrays\n- Time: O(log n)\n- Halve the search range each step' });
if (!(await Quiz.count({ where: { userId: student.id } })))
  await Quiz.create({ userId: student.id, topic: 'Binary Search basics', questions: [{ q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], answer: 1, explain: 'The search range is halved each step.' }] });
if (!(await StudyPlan.count({ where: { userId: student.id } })))
  await StudyPlan.create({ userId: student.id, goal: 'Learn data structures in 3 days', plan: [
    { day: 'Day 1', focus: 'Arrays and linked lists', tasks: ['Read basics', 'Solve 3 easy problems'], hours: 2 },
    { day: 'Day 2', focus: 'Stacks and queues', tasks: ['Implement both', 'Solve 3 problems'], hours: 2 },
    { day: 'Day 3', focus: 'Trees', tasks: ['Traversals', 'Solve 3 problems'], hours: 2 }] });

console.log('\nSeed complete. Demo logins:');
console.table([admin, teacher, student].map((u) => ({ role: u.role, email: u.email })));
console.log('Passwords: admin = ADMIN_PASSWORD from .env, teacher = Teacher@123, student = Student@123');
await sequelize.close();
