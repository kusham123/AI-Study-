import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import auth from './auth.routes.js';
import ai from './ai.routes.js';
import note from './note.routes.js';
import quiz from './quiz.routes.js';
import plan from './plan.routes.js';
import assignment from './assignment.routes.js';
import user from './user.routes.js';
import stats from './stats.routes.js';

const r = Router();
r.use('/auth', auth);                       // public
r.use(authenticate);                        // everything below needs a valid token
r.use('/ai', ai);
r.use('/notes', note);
r.use('/quizzes', quiz);
r.use('/plans', plan);
r.use('/assignments', assignment);
r.use('/users', user);
r.use('/stats', stats);
export default r;
