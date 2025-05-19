// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

/**
 * User routes for profile management and user-specific operations
 * All routes require authentication
 */

// Get user profile
router.get('/profile', auth, userController.getProfile);

// Update user profile
router.put('/profile', auth, userController.updateProfile);

// Add allergies
router.post('/allergies', auth, userController.addAllergies);

// Get assigned meal plans
router.get('/meal-plans', auth, userController.getMealPlans);

// Get health profile
router.get('/health-profile', auth, userController.getHealthProfile);

// Update health profile
router.put('/health-profile', auth, userController.updateHealthProfile);

// Request nutritionist
router.post('/request-nutritionist/:nutritionistId', auth, userController.requestNutritionist);

module.exports = router;