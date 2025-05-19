const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role, NutritionistProfile } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const { validateRegistration, validateLogin } = require('../utils/validation');
const config = require('../config/config');

/**
 * Authentication controller handling user registration, login, and profile retrieval
 */

const register = async (req, res, next) => {
    try {
        const validationErrors = validateRegistration(req.body);
        if (validationErrors.length > 0) {
            throw new ApiError(400, 'Validation error', validationErrors);
        }

        const { email, password, firstName, lastName, role = 'user' } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new ApiError(400, 'Email already registered');
        }

        const userRole = await Role.findOne({ where: { name: role } });
        if (!userRole) {
            throw new ApiError(400, 'Invalid role specified');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            passwordHash,
            firstName,
            lastName,
            roleId: userRole.id
        });

        if (role === 'nutritionist') {
            await NutritionistProfile.create({
                userId: user.id,
                specialization: req.body.specialization || '',
                bio: req.body.bio || '',
                approved: false
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: userRole.name
            },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
        );

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

const login = async (req, res, next) => {
    try {
        const validationErrors = validateLogin(req.body);
        if (validationErrors.length > 0) {
            throw new ApiError(400, 'Validation error', validationErrors);
        }

        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            include: [{ model: Role }]
        });

        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password');
        }

        if (user.Role.name === 'nutritionist') {
            const nutritionistProfile = await NutritionistProfile.findOne({
                where: { userId: user.id }
            });

            if (nutritionistProfile && !nutritionistProfile.approved) {
                throw new ApiError(403, 'Your nutritionist account is pending approval');
            }
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.Role.name
            },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
        );

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

const getCurrentUser = async (req, res, next) => {
    try {
        const { user } = req;

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

const logout = async (req, res, next) => {
    try {
        // Since JWT is stateless, a true logout happens on the client side
        // by removing the token, but we can handle any server-side cleanup here

        res.status(200).json({
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const { user } = req;

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.Role.name
            },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
        );

        res.status(200).json({
            message: 'Token refreshed',
            token
        });
    } catch (error) {
        next(error);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new ApiError(400, 'Email is required');
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            // Don't reveal whether a user exists for security reasons
            return res.status(200).json({
                message: 'If your email is registered, you will receive password reset instructions'
            });
        }

        // Generate a password reset token
        const resetToken = jwt.sign(
            { userId: user.id },
            config.jwtSecret,
            { expiresIn: '1h' }
        );

        // In a real application, you would send an email with the reset link
        // For now, we'll just return the token in the response
        // NOTE: In production, you should NEVER return the token in the response

        res.status(200).json({
            message: 'If your email is registered, you will receive password reset instructions',
            // For development only - remove in production
            resetToken
        });
    } catch (error) {
        next(error);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            throw new ApiError(400, 'Token and new password are required');
        }

        if (newPassword.length < 8) {
            throw new ApiError(400, 'New password must be at least 8 characters');
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.jwtSecret);
        } catch (error) {
            throw new ApiError(401, 'Invalid or expired token');
        }

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await user.update({ passwordHash });

        res.status(200).json({
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        next(error);
    }
}

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const { user } = req;

        if (!currentPassword || !newPassword) {
            throw new ApiError(400, 'Current password and new password are required');
        }

        if (newPassword.length < 8) {
            throw new ApiError(400, 'New password must be at least 8 characters');
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Current password is incorrect');
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);

        await user.update({ passwordHash });

        res.status(200).json({
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    getCurrentUser,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    changePassword
};