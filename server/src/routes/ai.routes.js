import { Router } from 'express';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import * as c from '../controllers/ai.controller.js';
const r = Router();
r.post('/ask', h(c.ask));
r.post('/summarize', h(c.summarize));
r.post('/recommend', h(c.recommend));
export default r;
