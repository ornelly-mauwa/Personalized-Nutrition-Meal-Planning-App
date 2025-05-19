// routes/mealPlanRoutes.js
const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const auth = require('../middleware/auth');

/**
 * Meal plan routes for managing meal plans and meals
 * All routes require authentication
 */

// Get a specific meal plan
router.get('/:id', auth, mealPlanController.getMealPlan);

// Update a meal plan (nutritionist only)
router.put('/:id', auth, mealPlanController.updateMealPlan);

// Get all meals in a meal plan
router.get('/:id/meals', auth, mealPlanController.getMealsInPlan);

// Add a meal to a meal plan (nutritionist only)
router.post('/:id/meals', auth, mealPlanController.addMealToPlan);

// Update a meal in a plan (nutritionist only)
router.put('/:id/meals/:mealId', auth, mealPlanController.updateMeal);

// Delete a meal from a plan (nutritionist only)
router.delete('/:id/meals/:mealId', auth, mealPlanController.deleteMeal);

module.exports = router;