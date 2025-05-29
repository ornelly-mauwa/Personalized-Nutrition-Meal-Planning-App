import express from 'express';

import { getDailySummary, getWeeklySummary } from '../controllers/trackingController.js';
import { verifyUser } from '../middleware/verification.js';

const router = express.Router();
// Daily summary route 
router.get('/daily-summary/:userId', getDailySummary);
router.get('/weekly-summary/:userId', getWeeklySummary);

export default router;

