// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, approveNutritionist, getDashboard } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');

/**
 * Admin Routes
 * ------------
 * Routes for user management and system administration
 * All routes require authentication and admin role
 */
//console.log('typeof getAllUsers', typeof getAllUsers);
//console.log('typeof auth', typeof auth);
//console.log('typeof requireAdmin', typeof requireAdmin);
// Get all users
router.get('/users', auth, requireAdmin, getAllUsers);

// Update user role
router.put('/users/:id/role', auth, requireAdmin, updateUserRole);

// Approve/disapprove nutritionist
router.put('/nutritionists/:id/approve', auth, requireAdmin, approveNutritionist);

// Get admin dashboard stats
router.get('/dashboard', auth, requireAdmin, getDashboard);

// Only uncomment these routes when you've implemented the corresponding controller methods:
/*
// Get a specific user by ID
router.get('/users/:id', auth, requireAdmin, adminController.getUserById);

// Disable/enable user account
router.patch('/users/:id/status', auth, requireAdmin, adminController.updateUserStatus);

// Delete user
router.delete('/users/:id', auth, requireAdmin, adminController.deleteUser);

// Get all nutritionists with their approval status
router.get('/nutritionists', auth, requireAdmin, adminController.getAllNutritionists);

// Get nutritionist application details
router.get('/nutritionists/:id/details', auth, requireAdmin, adminController.getNutritionistDetails);

// Get system logs
router.get('/logs', auth, requireAdmin, adminController.getSystemLogs);

// Generate usage reports
router.get('/reports', auth, requireAdmin, adminController.generateReports);

// Get system settings
router.get('/settings', auth, requireAdmin, adminController.getSystemSettings);

// Update system settings
router.put('/settings', auth, requireAdmin, adminController.updateSystemSettings);
*/

module.exports = router;