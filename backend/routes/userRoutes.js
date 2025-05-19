// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    updateHealthProfile,
    addAllergies,
    removeAllergy,
    getAllergies
} = require('../controllers/userController');
const {
    getMealPlan
} = require('../controllers/mealPlanController');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

/**
 * User routes for profile management and user-specific operations
 * All routes require authentication
 */

// Get user profile
router.get('/profile', auth, getProfile);

// Update user profile
router.put('/profile', auth, updateProfile);

// Add allergies
router.post('/allergies', auth, addAllergies);

// Get assigned meal plans
router.get('/meal-plans', auth, getMealPlan);

// Get health profile
//router.get('/health-profile', auth, getHealthProfile);

// Update health profile
router.put('/health-profile', auth, updateHealthProfile);

// Request nutritionist
//router.post('/request-nutritionist/:nutritionistId', auth, requestNutritionist);

module.exports = router;