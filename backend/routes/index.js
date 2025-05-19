// routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const nutritionistRoutes = require('./nutritionistRoutes');
const userRoutes = require('./userRoutes');
const mealPlanRoutes = require('./mealPlanRoutes');
const trackingRoutes = require('./trackingRoutes');

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/nutritionist', nutritionistRoutes);
router.use('/user', userRoutes);
router.use('/meal-plans', mealPlanRoutes);
router.use('/tracking', trackingRoutes);

module.exports = router;