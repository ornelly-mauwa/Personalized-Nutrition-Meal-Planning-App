const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role, NutritionistProfile } = require('../models');
const { ApiError } = require('../utils/errors');
const { validateRegistration, validateLogin } = require('../utils/validation');
const config = require('../config/config');

/**
 * Authentication controller handling user registration, login, and profile retrieval
 */
class AuthController {
    /**
     * Register a new user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async register(req, res, next) {
        try {
            // Validate request body
            const validationErrors = validateRegistration(req.body);
            if (validationErrors.length > 0) {
                throw new ApiError(400, 'Validation error', validationErrors);
            }

            const { email, password, firstName, lastName, role = 'user' } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new ApiError(400, 'Email already registered');
            }

            // Get role ID
            const userRole = await Role.findOne({ where: { name: role } });
            if (!userRole) {
                throw new ApiError(400, 'Invalid role specified');
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create user
            const user = await User.create({
                email,
                passwordHash,
                firstName,
                lastName,
                roleId: userRole.id
            });

            // If registering as nutritionist, create nutritionist profile
            if (role === 'nutritionist') {
                await NutritionistProfile.create({
                    userId: user.id,
                    specialization: req.body.specialization || '',
                    bio: req.body.bio || '',
                    approved: false // Needs admin approval
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: userRole.name
                },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            // Return user and token
            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: userRole.name
                },
                token
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Login a user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async login(req, res, next) {
        try {
            // Validate request body
            const validationErrors = validateLogin(req.body);
            if (validationErrors.length > 0) {
                throw new ApiError(400, 'Validation error', validationErrors);
            }

            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({
                where: { email },
                include: [
                    { model: Role }
                ]
            });

            // Check if user exists
            if (!user) {
                throw new ApiError(401, 'Invalid email or password');
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                throw new ApiError(401, 'Invalid email or password');
            }

            // Check if nutritionist is approved
            if (user.Role.name === 'nutritionist') {
                const nutritionistProfile = await NutritionistProfile.findOne({
                    where: { userId: user.id }
                });

                if (nutritionistProfile && !nutritionistProfile.approved) {
                    throw new ApiError(403, 'Your nutritionist account is pending approval');
                }
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: user.Role.name
                },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            // Return user and token
            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.Role.name
                },
                token
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get current authenticated user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getCurrentUser(req, res, next) {
        try {
            // User is already set by auth middleware
            const { user } = req;

            // Return user details
            res.status(200).json({
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.Role.name
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Refresh JWT token
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async refreshToken(req, res, next) {
        try {
            // User is already set by auth middleware
            const { user } = req;

            // Generate new JWT token
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: user.Role.name
                },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            // Return new token
            res.status(200).json({
                message: 'Token refreshed',
                token
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Change user password
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            const { user } = req;

            // Validate input
            if (!currentPassword || !newPassword) {
                throw new ApiError(400, 'Current password and new password are required');
            }

            if (newPassword.length < 8) {
                throw new ApiError(400, 'New password must be at least 8 characters');
            }

            // Verify current password
            const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
            if (!isPasswordValid) {
                throw new ApiError(401, 'Current password is incorrect');
            }

            // Hash new password
            const passwordHash = await bcrypt.hash(newPassword, 10);

            // Update user password
            await user.update({ passwordHash });

            res.status(200).json({
                message: 'Password changed successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();