// routes/mealPlanRoutes.js
const express = require('express');
const router = express.Router();
const {
    createMealPlan,
    createFromTemplate,
    getMealPlan,
    getUserMealPlans,
    getNutritionistMealPlans,
    updateMealPlan,
    addMealsToPlan,
    updateMeal,
    deleteMeal,
    getRecommendedMealPlans
} = require('../controllers/mealPlanController');
const auth = require('../middleware/auth');

/**
 * Meal plan routes for managing meal plans and meals
 * All routes require authentication
 */

// Get a specific meal plan
router.get('/:id', auth, getMealPlan);

// Update a meal plan (nutritionist only)
router.put('/:id', auth, updateMealPlan);

// Get all meals in a meal plan
router.get('/:id/meals', auth, getUserMealPlans);
// Get all meal plans for a nutritionist    

// Add a meal to a meal plan (nutritionist only)
router.post('/:id/meals', auth, addMealsToPlan);

// Update a meal in a plan (nutritionist only)
router.put('/:id/meals/:mealId', auth, updateMeal);

// Delete a meal from a plan (nutritionist only)
router.delete('/:id/meals/:mealId', auth, deleteMeal);

module.exports = router;