import { Router } from 'express';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import { allow } from '../middleware/auth.js';
import * as c from '../controllers/assignment.controller.js';
const r = Router();
r.get('/', h(c.list));
r.post('/', allow('teacher', 'admin'), h(c.create));
r.delete('/:id', allow('teacher', 'admin'), h(c.remove));
export default r;
