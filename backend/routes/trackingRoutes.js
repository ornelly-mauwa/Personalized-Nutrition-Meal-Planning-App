// routes/trackingRoutes.js
const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const auth = require('../middleware/auth');

/**
 * Tracking routes for logging meals and tracking progress
 * All routes require authentication
 */

// Log a meal
router.post('/meals', auth, trackingController.logMeal);

// Get meal logs
router.get('/meals', auth, trackingController.getMealLogs);

// Log weight
router.post('/weight', auth, trackingController.logWeight);

// Get weight history
router.get('/weight', auth, trackingController.getWeightHistory);

// Get progress summary
router.get('/progress', auth, trackingController.getProgressSummary);

module.exports = router;