// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, logout, refreshToken, forgotPassword, resetPassword, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

/**
 * Auth routes for registration, login, and user profile
 */

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getCurrentUser);
router.post('/logout', auth, logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;