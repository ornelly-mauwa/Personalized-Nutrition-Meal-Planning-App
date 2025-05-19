const {
    MealPlan,
    MealPlanMeal,
    MealPlanMealItem,
    TemplateMeal,
    TemplateMealItem,
    User,
    FoodItem
} = require('../models');
const nutritionService = require('./nutritionService');
const { Op } = require('sequelize');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Service for managing meal plans and related functionality
 */
class MealPlanService {
    /**
     * Create a new meal plan for a user
     * @param {Object} planData - Plan data including userId, nutritionistId, name, description, goals
     * @param {Array} mealsData - Array of meal data to include in the plan
     * @returns {Object} Created meal plan with related meals
     */
    async createMealPlan(planData, mealsData = []) {
        try {
            // Check if user exists
            const user = await User.findByPk(planData.userId);
            if (!user) {
                throw new ApiError(404, 'User not found');
            }

            // Create meal plan
            const mealPlan = await MealPlan.create({
                userId: planData.userId,
                nutritionistId: planData.nutritionistId,
                name: planData.name,
                description: planData.description,
                startDate: planData.startDate || new Date(),
                endDate: planData.endDate,
                calorieTarget: planData.calorieTarget,
                proteinTarget: planData.proteinTarget,
                carbTarget: planData.carbTarget,
                fatTarget: planData.fatTarget,
                active: planData.active || true,
                goals: planData.goals
            });

            // Add meals to the meal plan if provided
            if (mealsData && mealsData.length > 0) {
                await this.addMealsToPlan(mealPlan.id, mealsData);
            }

            return this.getMealPlanById(mealPlan.id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create a meal plan from a template
     * @param {Number} templateId - Template ID to use
     * @param {Number} userId - User ID to create plan for
     * @param {Number} nutritionistId - Nutritionist creating the plan
     * @param {Object} customizations - Optional customizations to apply to the template
     * @returns {Object} Created meal plan
     */
    async createMealPlanFromTemplate(templateId, userId, nutritionistId, customizations = {}) {
        try {
            // Fetch the template meals
            const templateMeals = await TemplateMeal.findAll({
                where: { templateId },
                include: [{ model: TemplateMealItem, include: [FoodItem] }]
            });

            if (!templateMeals || templateMeals.length === 0) {
                throw new ApiError(404, 'Template not found or has no meals');
            }

            // Create new meal plan
            const mealPlan = await MealPlan.create({
                userId,
                nutritionistId,
                name: customizations.name || 'Plan from template',
                description: customizations.description || 'Created from a template',
                startDate: customizations.startDate || new Date(),
                endDate: customizations.endDate,
                calorieTarget: customizations.calorieTarget,
                proteinTarget: customizations.proteinTarget,
                carbTarget: customizations.carbTarget,
                fatTarget: customizations.fatTarget,
                active: true,
                goals: customizations.goals || []
            });

            // Convert template meals to plan meals
            const mealsData = templateMeals.map(templateMeal => {
                const items = templateMeal.TemplateMealItems.map(item => ({
                    foodItemId: item.foodItemId,
                    quantity: item.quantity,
                    unit: item.unit
                }));

                return {
                    mealTypeId: templateMeal.mealTypeId,
                    name: templateMeal.name,
                    day: templateMeal.day || 1,
                    items
                };
            });

            // Add meals to the plan
            await this.addMealsToPlan(mealPlan.id, mealsData);

            return this.getMealPlanById(mealPlan.id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get a meal plan by ID with all related meals and items
     * @param {Number} mealPlanId - The meal plan ID
     * @returns {Object} The meal plan with all related data
     */
    async getMealPlanById(mealPlanId) {
        try {
            const mealPlan = await MealPlan.findByPk(mealPlanId, {
                include: [
                    {
                        model: MealPlanMeal,
                        include: [
                            {
                                model: MealPlanMealItem,
                                include: [FoodItem]
                            }
                        ]
                    },
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName', 'email']
                    }
                ]
            });

            if (!mealPlan) {
                throw new ApiError(404, 'Meal plan not found');
            }

            // Calculate nutritional totals
            const nutritionalTotals = await this.calculateMealPlanNutrition(mealPlan);

            // Format the response
            const result = mealPlan.toJSON();
            result.nutritionalTotals = nutritionalTotals;

            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all meal plans for a user
     * @param {Number} userId - User ID
     * @param {Object} options - Query options (active, limit, offset)
     * @returns {Array} List of meal plans
     */
    async getUserMealPlans(userId, options = {}) {
        try {
            const { active, limit = 10, offset = 0 } = options;

            const whereClause = { userId };
            if (active !== undefined) {
                whereClause.active = active;
            }

            const mealPlans = await MealPlan.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: User,
                        as: 'nutritionist',
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            });

            return {
                total: mealPlans.count,
                mealPlans: mealPlans.rows,
                limit,
                offset
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all meal plans created by a nutritionist
     * @param {Number} nutritionistId - Nutritionist ID
     * @param {Object} options - Query options
     * @returns {Array} List of meal plans
     */
    async getNutritionistMealPlans(nutritionistId, options = {}) {
        try {
            const { active, userId, limit = 10, offset = 0 } = options;

            const whereClause = { nutritionistId };
            if (active !== undefined) {
                whereClause.active = active;
            }
            if (userId) {
                whereClause.userId = userId;
            }

            const mealPlans = await MealPlan.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName', 'email']
                    }
                ]
            });

            return {
                total: mealPlans.count,
                mealPlans: mealPlans.rows,
                limit,
                offset
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update a meal plan
     * @param {Number} mealPlanId - Meal plan ID to update
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated meal plan
     */
    async updateMealPlan(mealPlanId, updateData) {
        try {
            const mealPlan = await MealPlan.findByPk(mealPlanId);

            if (!mealPlan) {
                throw new ApiError(404, 'Meal plan not found');
            }

            // Update basic meal plan data
            await mealPlan.update({
                name: updateData.name !== undefined ? updateData.name : mealPlan.name,
                description: updateData.description !== undefined ? updateData.description : mealPlan.description,
                startDate: updateData.startDate !== undefined ? updateData.startDate : mealPlan.startDate,
                endDate: updateData.endDate !== undefined ? updateData.endDate : mealPlan.endDate,
                calorieTarget: updateData.calorieTarget !== undefined ? updateData.calorieTarget : mealPlan.calorieTarget,
                proteinTarget: updateData.proteinTarget !== undefined ? updateData.proteinTarget : mealPlan.proteinTarget,
                carbTarget: updateData.carbTarget !== undefined ? updateData.carbTarget : mealPlan.carbTarget,
                fatTarget: updateData.fatTarget !== undefined ? updateData.fatTarget : mealPlan.fatTarget,
                active: updateData.active !== undefined ? updateData.active : mealPlan.active,
                goals: updateData.goals !== undefined ? updateData.goals : mealPlan.goals
            });

            return this.getMealPlanById(mealPlanId);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Add meals to an existing meal plan
     * @param {Number} mealPlanId - Meal plan ID
     * @param {Array} mealsData - Array of meal data to add
     * @returns {Array} Added meals
     */
    async addMealsToPlan(mealPlanId, mealsData) {
        try {
            const mealPlan = await MealPlan.findByPk(mealPlanId);

            if (!mealPlan) {
                throw new ApiError(404, 'Meal plan not found');
            }

            const addedMeals = [];

            // Add each meal
            for (const mealData of mealsData) {
                // Create the meal
                const meal = await MealPlanMeal.create({
                    mealPlanId,
                    mealTypeId: mealData.mealTypeId,
                    name: mealData.name,
                    day: mealData.day || 1
                });

                // Add meal items if provided
                if (mealData.items && mealData.items.length > 0) {
                    const mealItems = [];

                    for (const itemData of mealData.items) {
                        const mealItem = await MealPlanMealItem.create({
                            mealPlanMealId: meal.id,
                            foodItemId: itemData.foodItemId,
                            quantity: itemData.quantity,
                            unit: itemData.unit
                        });

                        mealItems.push(mealItem);
                    }

                    meal.items = mealItems;
                }

                addedMeals.push(meal);
            }

            return addedMeals;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update a specific meal in a meal plan
     * @param {Number} mealId - Meal ID to update
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated meal
     */
    async updateMeal(mealId, updateData) {
        try {
            const meal = await MealPlanMeal.findByPk(mealId);

            if (!meal) {
                throw new ApiError(404, 'Meal not found');
            }

            // Update meal data
            await meal.update({
                mealTypeId: updateData.mealTypeId !== undefined ? updateData.mealTypeId : meal.mealTypeId,
                name: updateData.name !== undefined ? updateData.name : meal.name,
                day: updateData.day !== undefined ? updateData.day : meal.day
            });

            // If meal items are provided, update them
            if (updateData.items) {
                // First, remove existing items
                await MealPlanMealItem.destroy({ where: { mealPlanMealId: mealId } });

                // Then add new items
                for (const itemData of updateData.items) {
                    await MealPlanMealItem.create({
                        mealPlanMealId: mealId,
                        foodItemId: itemData.foodItemId,
                        quantity: itemData.quantity,
                        unit: itemData.unit
                    });
                }
            }

            // Return updated meal with items
            return MealPlanMeal.findByPk(mealId, {
                include: [{ model: MealPlanMealItem, include: [FoodItem] }]
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete a meal from a meal plan
     * @param {Number} mealId - Meal ID to delete
     * @returns {Boolean} Success status
     */
    async deleteMeal(mealId) {
        try {
            const meal = await MealPlanMeal.findByPk(mealId);

            if (!meal) {
                throw new ApiError(404, 'Meal not found');
            }

            // Delete all meal items first
            await MealPlanMealItem.destroy({ where: { mealPlanMealId: mealId } });

            // Delete the meal
            await meal.destroy();

            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Calculate nutritional information for a meal plan
     * @param {Object} mealPlan - Meal plan with meals and items
     * @returns {Object} Nutritional totals
     */
    async calculateMealPlanNutrition(mealPlan) {
        try {
            // Initialize totals
            const nutritionalTotals = {
                byDay: {},
                overall: {
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0
                }
            };

            // Group meals by day
            for (const meal of mealPlan.MealPlanMeals) {
                const day = meal.day.toString();

                // Initialize day totals if not exists
                if (!nutritionalTotals.byDay[day]) {
                    nutritionalTotals.byDay[day] = {
                        calories: 0,
                        protein: 0,
                        carbs: 0,
                        fat: 0,
                        meals: []
                    };
                }

                // Calculate meal nutrition
                const mealNutrition = {
                    id: meal.id,
                    name: meal.name,
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0
                };

                // Sum up nutrition for all items in the meal
                for (const item of meal.MealPlanMealItems) {
                    if (item.FoodItem) {
                        const itemNutrition = nutritionService.calculateItemNutrition(
                            item.FoodItem,
                            item.quantity,
                            item.unit
                        );

                        // Add to meal totals
                        mealNutrition.calories += itemNutrition.calories;
                        mealNutrition.protein += itemNutrition.protein;
                        mealNutrition.carbs += itemNutrition.carbs;
                        mealNutrition.fat += itemNutrition.fat;
                    }
                }

                // Add meal nutrition to day totals
                nutritionalTotals.byDay[day].calories += mealNutrition.calories;
                nutritionalTotals.byDay[day].protein += mealNutrition.protein;
                nutritionalTotals.byDay[day].carbs += mealNutrition.carbs;
                nutritionalTotals.byDay[day].fat += mealNutrition.fat;
                nutritionalTotals.byDay[day].meals.push(mealNutrition);

                // Add to overall totals
                nutritionalTotals.overall.calories += mealNutrition.calories;
                nutritionalTotals.overall.protein += mealNutrition.protein;
                nutritionalTotals.overall.carbs += mealNutrition.carbs;
                nutritionalTotals.overall.fat += mealNutrition.fat;
            }

            // Calculate daily averages
            const dayCount = Object.keys(nutritionalTotals.byDay).length || 1;
            nutritionalTotals.dailyAverage = {
                calories: nutritionalTotals.overall.calories / dayCount,
                protein: nutritionalTotals.overall.protein / dayCount,
                carbs: nutritionalTotals.overall.carbs / dayCount,
                fat: nutritionalTotals.overall.fat / dayCount
            };

            // Calculate compliance with targets if available
            if (mealPlan.calorieTarget || mealPlan.proteinTarget ||
                mealPlan.carbTarget || mealPlan.fatTarget) {
                nutritionalTotals.compliance = {
                    calorieCompliance: mealPlan.calorieTarget ?
                        (nutritionalTotals.dailyAverage.calories / mealPlan.calorieTarget) * 100 : null,
                    proteinCompliance: mealPlan.proteinTarget ?
                        (nutritionalTotals.dailyAverage.protein / mealPlan.proteinTarget) * 100 : null,
                    carbCompliance: mealPlan.carbTarget ?
                        (nutritionalTotals.dailyAverage.carbs / mealPlan.carbTarget) * 100 : null,
                    fatCompliance: mealPlan.fatTarget ?
                        (nutritionalTotals.dailyAverage.fat / mealPlan.fatTarget) * 100 : null
                };
            }

            return nutritionalTotals;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get recommended meal plans based on user profile
     * @param {Number} userId - User ID
     * @returns {Array} List of recommended meal plans
     */
    async getRecommendedMealPlans(userId) {
        try {
            const user = await User.findByPk(userId, {
                include: ['healthProfile']
            });

            if (!user || !user.healthProfile) {
                throw new ApiError(404, 'User or health profile not found');
            }

            // Get active meal plans for the user
            const userActivePlans = await MealPlan.findAll({
                where: { userId, active: true },
                limit: 1,
                order: [['createdAt', 'DESC']]
            });

            // If user already has active plans, recommend similar ones
            if (userActivePlans.length > 0) {
                const activePlan = userActivePlans[0];

                // Find similar plans based on nutritional targets
                const similarPlans = await MealPlan.findAll({
                    where: {
                        id: { [Op.ne]: activePlan.id },
                        userId: { [Op.ne]: userId },
                        calorieTarget: {
                            [Op.between]: [
                                activePlan.calorieTarget * 0.9,
                                activePlan.calorieTarget * 1.1
                            ]
                        }
                    },
                    limit: 5,
                    include: [
                        {
                            model: User,
                            as: 'nutritionist',
                            attributes: ['id', 'firstName', 'lastName']
                        }
                    ]
                });

                return similarPlans;
            }
            // Otherwise recommend based on health profile
            else {
                const { weightGoal, activityLevel, currentWeight } = user.healthProfile;

                // Example logic for recommendation
                let recommendedCalories;

                // Basic BMR calculation (simplified)
                const bmr = currentWeight * 10; // Simplified BMR calculation

                switch (activityLevel) {
                    case 'sedentary':
                        recommendedCalories = bmr * 1.2;
                        break;
                    case 'light':
                        recommendedCalories = bmr * 1.375;
                        break;
                    case 'moderate':
                        recommendedCalories = bmr * 1.55;
                        break;
                    case 'active':
                        recommendedCalories = bmr * 1.725;
                        break;
                    case 'very_active':
                        recommendedCalories = bmr * 1.9;
                        break;
                    default:
                        recommendedCalories = bmr * 1.5;
                }

                // Adjust based on weight goal
                if (weightGoal === 'lose') {
                    recommendedCalories *= 0.8; // 20% deficit
                } else if (weightGoal === 'gain') {
                    recommendedCalories *= 1.2; // 20% surplus
                }

                // Find plans matching these criteria
                const recommendedPlans = await MealPlan.findAll({
                    where: {
                        calorieTarget: {
                            [Op.between]: [
                                recommendedCalories * 0.9,
                                recommendedCalories * 1.1
                            ]
                        }
                    },
                    limit: 5,
                    include: [
                        {
                            model: User,
                            as: 'nutritionist',
                            attributes: ['id', 'firstName', 'lastName']
                        }
                    ]
                });

                return recommendedPlans;
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MealPlanService();