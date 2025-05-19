// controllers/nutritionistController.js
const { User, UserMealPlan, MealPlanTemplate, NutritionistProfile, UserHealthProfile } = require('../models');
const { validateMealPlanTemplate, validateUserMealPlan } = require('../utils/validation');
const { Op } = require('sequelize');

/**
 * Controller for handling nutritionist-specific operations
 */
class NutritionistController {
    /**
     * Get all clients assigned to the nutritionist
     */
    async getClients(req, res) {
        try {
            const nutritionistId = req.user.id;

            // Find nutritionist profile to verify the user is indeed a nutritionist
            const nutritionistProfile = await NutritionistProfile.findOne({
                where: { userId: nutritionistId }
            });

            if (!nutritionistProfile) {
                return res.status(403).json({ message: 'You are not registered as a nutritionist' });
            }

            // Get users assigned to this nutritionist
            const clients = await User.findAll({
                include: [
                    {
                        model: UserHealthProfile,
                        where: { nutritionistId: nutritionistId },
                        required: true
                    }
                ],
                attributes: { exclude: ['password_hash'] } // Exclude sensitive information
            });

            return res.json(clients);
        } catch (error) {
            console.error('Error getting clients:', error);
            return res.status(500).json({ message: 'Failed to retrieve clients' });
        }
    }

    /**
     * Create a meal plan template that can be reused
     */
    async createMealPlanTemplate(req, res) {
        try {
            const { error } = validateMealPlanTemplate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const nutritionistId = req.user.id;
            const { name, description, targetGoal, meals } = req.body;

            // Create the meal plan template
            const template = await MealPlanTemplate.create({
                nutritionistId,
                name,
                description,
                targetGoal
            });

            // Add meals to the template
            if (meals && meals.length > 0) {
                for (const meal of meals) {
                    const templateMeal = await TemplateMeal.create({
                        templateId: template.id,
                        name: meal.name,
                        mealTypeId: meal.mealTypeId,
                        calories: meal.calories,
                        protein: meal.protein,
                        carbs: meal.carbs,
                        fat: meal.fat
                    });

                    // Add items to the meal
                    if (meal.items && meal.items.length > 0) {
                        for (const item of meal.items) {
                            await TemplateMealItem.create({
                                templateMealId: templateMeal.id,
                                foodItemId: item.foodItemId,
                                quantity: item.quantity,
                                unit: item.unit
                            });
                        }
                    }
                }
            }

            return res.status(201).json({
                message: 'Meal plan template created successfully',
                template
            });
        } catch (error) {
            console.error('Error creating meal plan template:', error);
            return res.status(500).json({ message: 'Failed to create meal plan template' });
        }
    }

    /**
     * Create a meal plan for a specific user
     */
    async createUserMealPlan(req, res) {
        try {
            const { error } = validateUserMealPlan(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const nutritionistId = req.user.id;
            const { userId, name, startDate, endDate, templateId, customMeals } = req.body;

            // Verify that the client is assigned to this nutritionist
            const clientProfile = await UserHealthProfile.findOne({
                where: {
                    userId: userId,
                    nutritionistId: nutritionistId
                }
            });

            if (!clientProfile) {
                return res.status(403).json({ message: 'This client is not assigned to you' });
            }

            // Create new meal plan for the user
            const userMealPlan = await UserMealPlan.create({
                userId,
                nutritionistId,
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            });

            // If using a template, copy meals from template
            if (templateId) {
                const template = await MealPlanTemplate.findByPk(templateId, {
                    include: [{
                        model: TemplateMeal,
                        include: [TemplateMealItem]
                    }]
                });

                if (!template) {
                    return res.status(404).json({ message: 'Template not found' });
                }

                // Copy template meals to user meal plan
                for (const templateMeal of template.meals) {
                    const meal = await UserMeal.create({
                        mealPlanId: userMealPlan.id,
                        name: templateMeal.name,
                        mealTypeId: templateMeal.mealTypeId,
                        day: 1, // Default to day 1, adjust as needed
                        calories: templateMeal.calories,
                        protein: templateMeal.protein,
                        carbs: templateMeal.carbs,
                        fat: templateMeal.fat
                    });

                    // Copy meal items
                    for (const templateItem of templateMeal.items) {
                        await UserMealItem.create({
                            mealId: meal.id,
                            foodItemId: templateItem.foodItemId,
                            quantity: templateItem.quantity,
                            unit: templateItem.unit
                        });
                    }
                }
            }

            // Add custom meals if provided
            if (customMeals && customMeals.length > 0) {
                for (const customMeal of customMeals) {
                    const meal = await UserMeal.create({
                        mealPlanId: userMealPlan.id,
                        name: customMeal.name,
                        mealTypeId: customMeal.mealTypeId,
                        day: customMeal.day || 1,
                        calories: customMeal.calories,
                        protein: customMeal.protein,
                        carbs: customMeal.carbs,
                        fat: customMeal.fat
                    });

                    // Add items to the meal
                    if (customMeal.items && customMeal.items.length > 0) {
                        for (const item of customMeal.items) {
                            await UserMealItem.create({
                                mealId: meal.id,
                                foodItemId: item.foodItemId,
                                quantity: item.quantity,
                                unit: item.unit
                            });
                        }
                    }
                }
            }

            return res.status(201).json({
                message: 'User meal plan created successfully',
                userMealPlan
            });
        } catch (error) {
            console.error('Error creating user meal plan:', error);
            return res.status(500).json({ message: 'Failed to create user meal plan' });
        }
    }

    /**
     * Get nutritionist dashboard statistics
     */
    async getDashboard(req, res) {
        try {
            const nutritionistId = req.user.id;

            // Count total clients
            const clientCount = await UserHealthProfile.count({
                where: { nutritionistId }
            });

            // Count active meal plans
            const activeMealPlans = await UserMealPlan.count({
                where: {
                    nutritionistId,
                    endDate: {
                        [Op.gte]: new Date()
                    }
                }
            });

            // Count meal plan templates
            const templateCount = await MealPlanTemplate.count({
                where: { nutritionistId }
            });

            // Get recent meal plans created (last 10)
            const recentMealPlans = await UserMealPlan.findAll({
                where: { nutritionistId },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName', 'email']
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: 10
            });

            // Get clients with upcoming meal plan expirations (next 7 days)
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

            const upcomingExpirations = await UserMealPlan.findAll({
                where: {
                    nutritionistId,
                    endDate: {
                        [Op.between]: [new Date(), sevenDaysFromNow]
                    }
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName', 'email']
                    }
                ],
                order: [['endDate', 'ASC']]
            });

            return res.json({
                clientCount,
                activeMealPlans,
                templateCount,
                recentMealPlans,
                upcomingExpirations
            });
        } catch (error) {
            console.error('Error getting nutritionist dashboard:', error);
            return res.status(500).json({ message: 'Failed to retrieve dashboard data' });
        }
    }
}

module.exports = new NutritionistController();