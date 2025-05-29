import express from 'express';
import { createMealPlan, getUserMealPlan } from '../controllers/mealPlanController.js';

const router = express.Router();

router.post('/', createMealPlan);         // POST /meal-plans
router.get('/:userId', getUserMealPlan);  // GET /meal-plans/:userId

export default router;
