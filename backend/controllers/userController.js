const { User, UserHealthProfile, UserAllergy } = require('../models');
const { ApiError } = require('../utils/errors');
const { validateUserProfile, validateHealthProfile } = require('../utils/validation');

/**
 * Controller for user-related operations
 */
class UserController {
    /**
     * Get user profile including health data
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getProfile(req, res, next) {
        try {
            const { userId } = req.user;

            // Fetch user with health profile and allergies
            const user = await User.findByPk(userId, {
                include: [
                    { model: UserHealthProfile, as: 'healthProfile' },
                    { model: UserAllergy, as: 'allergies' }
                ],
                attributes: {
                    exclude: ['passwordHash', 'roleId']
                }
            });

            if (!user) {
                throw new ApiError(404, 'User not found');
            }

            res.status(200).json({ user });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update user profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateProfile(req, res, next) {
        try {
            const { userId } = req.user;
            const { firstName, lastName, email } = req.body;

            // Validate request body
            const validationErrors = validateUserProfile(req.body);
            if (validationErrors.length > 0) {
                throw new ApiError(400, 'Validation error', validationErrors);
            }

            // Check if email is already taken (if email is being updated)
            if (email) {
                const existingUser = await User.findOne({
                    where: { email },
                    attributes: ['id']
                });

                if (existingUser && existingUser.id !== userId) {
                    throw new ApiError(400, 'Email is already registered');
                }
            }

            // Fetch user
            const user = await User.findByPk(userId);
            if (!user) {
                throw new ApiError(404, 'User not found');
            }

            // Update user data
            await user.update({
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                email: email || user.email
            });

            // Return updated user (without sensitive data)
            const updatedUser = await User.findByPk(userId, {
                attributes: {
                    exclude: ['passwordHash', 'roleId']
                }
            });

            res.status(200).json({
                message: 'Profile updated successfully',
                user: updatedUser
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update or create user health profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateHealthProfile(req, res, next) {
        try {
            const { userId } = req.user;
            const healthData = req.body;

            // Validate health profile data
            const validationErrors = validateHealthProfile(healthData);
            if (validationErrors.length > 0) {
                throw new ApiError(400, 'Validation error', validationErrors);
            }

            // Check if health profile exists
            let healthProfile = await UserHealthProfile.findOne({
                where: { userId }
            });

            // Create or update health profile
            if (healthProfile) {
                await healthProfile.update({
                    gender: healthData.gender || healthProfile.gender,
                    dateOfBirth: healthData.dateOfBirth || healthProfile.dateOfBirth,
                    height: healthData.height || healthProfile.height,
                    currentWeight: healthData.currentWeight || healthProfile.currentWeight,
                    targetWeight: healthData.targetWeight || healthProfile.targetWeight,
                    activityLevel: healthData.activityLevel || healthProfile.activityLevel,
                    weightGoal: healthData.weightGoal || healthProfile.weightGoal,
                    dietaryPreferences: healthData.dietaryPreferences || healthProfile.dietaryPreferences,
                    healthConditions: healthData.healthConditions || healthProfile.healthConditions
                });
            } else {
                healthProfile = await UserHealthProfile.create({
                    userId,
                    gender: healthData.gender,
                    dateOfBirth: healthData.dateOfBirth,
                    height: healthData.height,
                    currentWeight: healthData.currentWeight,
                    targetWeight: healthData.targetWeight,
                    activityLevel: healthData.activityLevel,
                    weightGoal: healthData.weightGoal,
                    dietaryPreferences: healthData.dietaryPreferences || [],
                    healthConditions: healthData.healthConditions || []
                });
            }

            res.status(200).json({
                message: 'Health profile updated successfully',
                healthProfile
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Add user allergies
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async addAllergies(req, res, next) {
        try {
            const { userId } = req.user;
            const { allergies } = req.body;

            // Validate input
            if (!allergies || !Array.isArray(allergies) || allergies.length === 0) {
                throw new ApiError(400, 'Allergies must be provided as an array');
            }

            // Add each allergy
            const createdAllergies = [];
            for (const allergyName of allergies) {
                // Check if allergy already exists
                const existingAllergy = await UserAllergy.findOne({
                    where: {
                        userId,
                        allergyName
                    }
                });

                if (!existingAllergy) {
                    const allergy = await UserAllergy.create({
                        userId,
                        allergyName,
                        severity: req.body.severity || 'medium'
                    });
                    createdAllergies.push(allergy);
                }
            }

            // Get all user allergies
            const userAllergies = await UserAllergy.findAll({
                where: { userId }
            });

            res.status(201).json({
                message: 'Allergies added successfully',
                addedCount: createdAllergies.length,
                allergies: userAllergies
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Remove user allergy
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async removeAllergy(req, res, next) {
        try {
            const { userId } = req.user;
            const { allergyId } = req.params;

            // Find allergy
            const allergy = await UserAllergy.findOne({
                where: {
                    id: allergyId,
                    userId
                }
            });

            if (!allergy) {
                throw new ApiError(404, 'Allergy not found');
            }

            // Delete allergy
            await allergy.destroy();

            // Get remaining allergies
            const remainingAllergies = await UserAllergy.findAll({
                where: { userId }
            });

            res.status(200).json({
                message: 'Allergy removed successfully',
                allergies: remainingAllergies
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all user allergies
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getAllergies(req, res, next) {
        try {
            const { userId } = req.user;

            // Get all user allergies
            const allergies = await UserAllergy.findAll({
                where: { userId }
            });

            res.status(200).json({ allergies });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();