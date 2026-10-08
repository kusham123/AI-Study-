import { Router } from 'express';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import * as c from '../controllers/auth.controller.js';
const r = Router();
r.post('/register', h(c.register));
r.post('/login', h(c.login));
export default r;
