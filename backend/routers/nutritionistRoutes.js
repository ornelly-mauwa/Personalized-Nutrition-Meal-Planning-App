// routes/nutritionistRoutes.js
const express = require('express');
const router = express.Router();
const {
    getClients,
    createMealPlanTemplate,
    createUserMealPlan,
    getDashboard
} = require('../controllers/nutritionistController');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

/**
 * Nutritionist routes for managing clients and creating meal plans
 * All routes require authentication and nutritionist role
 */

// Get all clients assigned to nutritionist
router.get('/clients', auth, roleCheck('nutritionist'), getClients);

// Create a meal plan template
router.post('/templates', auth, roleCheck('nutritionist'), createMealPlanTemplate);

// Create a meal plan for a user
router.post('/plans', auth, roleCheck('nutritionist'), createUserMealPlan);

// Get nutritionist dashboard stats
router.get('/dashboard', auth, roleCheck('nutritionist'), getDashboard);

module.exports = router;