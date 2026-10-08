# AI Study – AI Learning Platform
React + Tailwind · Node/Express · MySQL (Sequelize) · OpenAI-compatible AI API (Gemini free tier supported) · AWS RDS · Render

## Features
- Personalized study plans, AI tutor chat, text summarizer, auto-generated notes and quizzes
- Learning recommendations from your recent notes and quizzes (OpenAI)
- Role-based access: **Student** (tutor, notes, quizzes, plans), **Teacher** (assignments), **Admin** (manage users and roles)

## Run locally
```bash
# 1. Create a MySQL database named ai_study
cd server && cp .env.example .env   # fill in DB + AI_API_KEY
npm install
npm run seed                        # creates DB + all tables + demo data
npm run dev

cd ../client && cp .env.example .env
npm install && npm run dev          # http://localhost:5173
```
Demo logins after seeding: admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD`), `teacher@aistudy.com` / `Teacher@123`, `student@aistudy.com` / `Student@123`.
`npm run seed:fresh` drops all tables and rebuilds them.

## Backend structure
```
server/src
├── config/db.js            Sequelize connection
├── models/                 User, Note, Quiz, StudyPlan, Assignment (one file each) + index.js (relations)
├── controllers/            auth, ai, note, quiz, plan, assignment, user, stats
├── routes/                 *.routes.js per resource + index.js (mounts all, applies auth)
├── middleware/             auth (JWT + roles), errorHandler
├── services/openai.service.js
├── seeders/seed.js         creates database, tables, demo data
└── index.js
```

## Deploy
1. AWS: create an RDS MySQL instance, allow inbound 3306, and copy the endpoint into `DB_HOST`.
2. Render: connect the repo and use `render.yaml` (API web service + static client). Set the env vars it lists.
3. Set `CLIENT_URL` on the API to the client URL and `VITE_API_URL` on the client to the API URL + `/api`.

## API
`POST /api/auth/register|login` · `POST /api/ai/ask|summarize|recommend` · `GET /api/notes|quizzes|plans`, `POST …/generate`, `DELETE …/:id` · `GET/POST/DELETE /api/assignments` · `GET /api/users`, `PUT /api/users/:id/role` (admin)
