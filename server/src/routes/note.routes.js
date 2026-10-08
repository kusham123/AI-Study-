import { Router } from 'express';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import * as c from '../controllers/note.controller.js';
const r = Router();
r.get('/', h(c.list));
r.post('/generate', h(c.generate));
r.delete('/:id', h(c.remove));
export default r;
