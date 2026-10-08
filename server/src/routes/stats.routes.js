import { Router } from 'express';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import { stats } from '../controllers/stats.controller.js';
const r = Router();
r.get('/', h(stats));
export default r;
