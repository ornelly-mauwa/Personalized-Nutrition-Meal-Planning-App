

// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

/**
 * Admin routes for user management and system administration
 * All routes require authentication and admin role
 */

// Get all users
router.get('/users', auth, roleCheck('admin'), adminController.getAllUsers);

// Update user role
router.put('/users/:id/role', auth, roleCheck('admin'), adminController.updateUserRole);

// Approve/disapprove nutritionist
router.put('/nutritionists/:id/approve', auth, roleCheck('admin'), adminController.approveNutritionist);

// Get admin dashboard stats
router.get('/dashboard', auth, roleCheck('admin'), adminController.getDashboard);

module.exports = router;
