import express from 'express';
import {
    logMeal,
    getDailyMeals,
    getWeeklyMeals,
    updateMealLog,
    deleteMealLog
} from '../controllers/mealLogController.js';
import authMiddleware from '../middleware/auth.js';
import { verifyUser, verifyNutritionist, verifyAdmin } from '../middleware/verification.js';
const router = express.Router();

router.post('/', authMiddleware, verifyUser, logMeal);
router.get('/daily/:userId', authMiddleware, verifyUser, getDailyMeals);
router.get('/weekly/:userId', authMiddleware, verifyUser, getWeeklyMeals);
router.put('/:id', authMiddleware, verifyUser, updateMealLog);
router.delete('/:id', authMiddleware, verifyUser, deleteMealLog);

export default router;
