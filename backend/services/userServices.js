// services/userService.js
const { User, Role, UserHealthProfile, NutritionistProfile, WeightLog, UserAllergy, FoodItem } = require('../models');
const { hashPassword, calculateBMR, calculateTDEE, calculateMacros } = require('../utils/helpers');

class UserService {
    // Create a new user
    async createUser(userData) {
        const { email, password, first_name, last_name, role_name = 'user' } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Find the role
        const role = await Role.findOne({ where: { name: role_name } });
        if (!role) {
            throw new Error('Invalid role specified');
        }

        // Hash password
        const password_hash = await hashPassword(password);

        // Create user
        const user = await User.create({
            email,
            password_hash,
            first_name,
            last_name,
            role_id: role.id,
            email_verified: false,
            is_active: true
        });

        // Create health profile for regular users
        if (role_name === 'user') {
            await UserHealthProfile.create({ user_id: user.id });
        }

        // Create nutritionist profile for nutritionists
        if (role_name === 'nutritionist') {
            await NutritionistProfile.create({
                user_id: user.id,
                status: 'pending' // Requires admin approval
            });
        }

        return user;
    }

    // Get user by ID with related data
    async getUserById(userId, includeRelations = true) {
        const includeOptions = includeRelations ? [
            {
                model: Role,
                as: 'role',
                attributes: ['name', 'permissions']
            },
            {
                model: UserHealthProfile,
                as: 'healthProfile'
            },
            {
                model: NutritionistProfile,
                as: 'nutritionistProfile'
            }
        ] : [];

        const user = await User.findByPk(userId, {
            include: includeOptions,
            attributes: { exclude: ['password_hash'] }
        });

        return user;
    }

    // Get user by email
    async getUserByEmail(email, includePassword = false) {
        const attributes = includePassword
            ? undefined
            : { exclude: ['password_hash'] };

        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['name', 'permissions']
                }
            ],
            attributes
        });

        return user;
    }

    // Update user profile
    async updateUser(userId, updateData) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Handle password update
        if (updateData.password) {
            updateData.password_hash = await hashPassword(updateData.password);
            delete updateData.password;
        }

        await user.update(updateData);
        return await this.getUserById(userId);
    }

    // Update user health profile
    async updateHealthProfile(userId, healthData) {
        let healthProfile = await UserHealthProfile.findOne({ where: { user_id: userId } });

        if (!healthProfile) {
            healthProfile = await UserHealthProfile.create({
                user_id: userId,
                ...healthData
            });
        } else {
            await healthProfile.update(healthData);
        }

        // Calculate and update nutritional targets if profile is complete
        if (healthProfile.age && healthProfile.gender && healthProfile.height && healthProfile.current_weight && healthProfile.activity_level && healthProfile.goal) {
            const bmr = calculateBMR(
                healthProfile.current_weight,
                healthProfile.height,
                healthProfile.age,
                healthProfile.gender
            );

            let tdee = calculateTDEE(bmr, healthProfile.activity_level);

            // Adjust calories based on goal
            let targetCalories;
            switch (healthProfile.goal) {
                case 'weight_loss':
                    targetCalories = tdee - 500; // 1 lb per week deficit
                    break;
                case 'weight_gain':
                    targetCalories = tdee + 500; // 1 lb per week surplus
                    break;
                case 'muscle_gain':
                    targetCalories = tdee + 300; // Lean bulk
                    break;
                default:
                    targetCalories = tdee; // Maintenance
            }

            const macros = calculateMacros(targetCalories, healthProfile.goal);

            await healthProfile.update({
                bmr,
                tdee,
                target_calories: targetCalories,
                target_protein: macros.protein,
                target_carbs: macros.carbs,
                target_fats: macros.fats
            });
        }

        return healthProfile;
    }

    // Get all users with pagination and filtering
    async getAllUsers(page = 0, limit = 10, filters = {}) {
        const offset = page * limit;
        const where = {};

        // Apply filters
        if (filters.role) {
            const role = await Role.findOne({ where: { name: filters.role } });
            if (role) where.role_id = role.id;
        }

        if (filters.is_active !== undefined) {
            where.is_active = filters.is_active;
        }

        if (filters.email_verified !== undefined) {
            where.email_verified = filters.email_verified;
        }

        const users = await User.findAndCountAll({
            where,
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['name']
                },
                {
                    model: UserHealthProfile,
                    as: 'healthProfile',
                    attributes: ['goal', 'activity_level']
                },
                {
                    model: NutritionistProfile,
                    as: 'nutritionistProfile',
                    attributes: ['status', 'credentials']
                }
            ],
            attributes: { exclude: ['password_hash'] },
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        return users;
    }

    // Add allergy to user
    async addAllergy(userId, foodItemId) {
        // Check if allergy already exists
        const existingAllergy = await UserAllergy.findOne({
            where: { user_id: userId, food_item_id: foodItemId }
        });

        if (existingAllergy) {
            throw new Error('Allergy already exists');
        }

        const allergy = await UserAllergy.create({
            user_id: userId,
            food_item_id: foodItemId
        });

        return allergy;
    }

    // Remove allergy from user
    async removeAllergy(userId, foodItemId) {
        const result = await UserAllergy.destroy({
            where: { user_id: userId, food_item_id: foodItemId }
        });

        if (result === 0) {
            throw new Error('Allergy not found');
        }

        return true;
    }

    // Get user allergies
    async getUserAllergies(userId) {
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: FoodItem,
                    as: 'allergies',
                    attributes: ['id', 'name', 'category'],
                    through: { attributes: [] }
                }
            ]
        });

        return user ? user.allergies : [];
    }

    // Log user weight
    async logWeight(userId, weightData) {
        const weightLog = await WeightLog.create({
            user_id: userId,
            ...weightData,
            logged_date: weightData.logged_date || new Date()
        });

        // Update current weight in health profile if this is the most recent entry
        const healthProfile = await UserHealthProfile.findOne({ where: { user_id: userId } });
        if (healthProfile) {
            const latestWeight = await WeightLog.findOne({
                where: { user_id: userId },
                order: [['logged_date', 'DESC'], ['logged_time', 'DESC']]
            });

            if (latestWeight && latestWeight.id === weightLog.id) {
                await healthProfile.update({ current_weight: weightLog.weight });
            }
        }

        return weightLog;
    }

    // Get user weight history
    async getWeightHistory(userId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const weights = await WeightLog.findAll({
            where: {
                user_id: userId,
                logged_date: {
                    [require('sequelize').Op.gte]: startDate
                }
            },
            order: [['logged_date', 'ASC'], ['logged_time', 'ASC']]
        });

        return weights;
    }

    // Deactivate user
    async deactivateUser(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await user.update({ is_active: false });
        return user;
    }

    // Reactivate user
    async reactivateUser(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await user.update({ is_active: true });
        return user;
    }

    // Change user role
    async changeUserRole(userId, newRoleName) {
        const role = await Role.findOne({ where: { name: newRoleName } });
        if (!role) {
            throw new Error('Invalid role specified');
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await user.update({ role_id: role.id });

        // Create appropriate profile if role changed to nutritionist
        if (newRoleName === 'nutritionist') {
            const existingProfile = await NutritionistProfile.findOne({ where: { user_id: userId } });
            if (!existingProfile) {
                await NutritionistProfile.create({
                    user_id: userId,
                    status: 'pending'
                });
            }
        }

        return await this.getUserById(userId);
    }
}

module.exports = new UserService();