// routes/trackingRoutes.js
const express = require('express');
const router = express.Router();
const {
    logMeal,
    getMealLogs,
    logWeight,
    getWeightHistory,
    getProgressSummary
} = require('../controllers/trackingController');
const auth = require('../middleware/auth');

/**
 * Tracking routes for logging meals and tracking progress
 * All routes require authentication
 */

// Log a meal
router.post('/meals', auth, logMeal);

// Get meal logs
router.get('/meals', auth, getMealLogs);

// Log weight
router.post('/weight', auth, logWeight);

// Get weight history
router.get('/weight', auth, getWeightHistory);

// Get progress summary
router.get('/progress', auth, getProgressSummary);

module.exports = router;