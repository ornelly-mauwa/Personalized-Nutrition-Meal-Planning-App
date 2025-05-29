import express from 'express';
import getSafeMeals from '../controllers/mealSuggestionController.js';
import { verifyUser } from '../middleware/verification.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/safe/:userId', authMiddleware, verifyUser, getSafeMeals);

export default router;
