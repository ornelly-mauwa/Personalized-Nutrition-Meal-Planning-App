import express from 'express';
import { logWeight, getWeightLogs } from '../controllers/weightLogController.js';

const router = express.Router();

router.post('/', logWeight);             // POST /weight-logs
router.get('/:userId', getWeightLogs);   // GET /weight-logs/:userId

export default router;
