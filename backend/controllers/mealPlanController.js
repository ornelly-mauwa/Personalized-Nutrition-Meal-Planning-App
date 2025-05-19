const mealPlanService = require('../services/mealPlanService');
const { ApiError } = require('../middleware/errorHandler');
const { validateMealPlan, validateMeal } = require('../utils/validation');

/**
 * Controller for meal plan operations
 */

/**
 * Create a new meal plan
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createMealPlan = async (req, res, next) => {
    try {
        const { role, userId } = req.user;
        const { planData, meals } = req.body;

        // Validate meal plan data
        const validationErrors = validateMealPlan(planData);
        if (validationErrors.length > 0) {
            throw new ApiError(400, 'Validation error', validationErrors);
        }

        // Only nutritionists can create meal plans for other users
        if (role !== 'nutritionist' && role !== 'admin' && planData.userId !== userId) {
            throw new ApiError(403, 'You can only create meal plans for yourself');
        }

        // Set nutritionist ID if creator is a nutritionist
        if (role === 'nutritionist') {
            planData.nutritionistId = userId;
        }

        // Create meal plan
        const mealPlan = await mealPlanService.createMealPlan(planData, meals);

        res.status(201).json({
            message: 'Meal plan created successfully',
            mealPlan
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Create a meal plan from a template
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createFromTemplate = async (req, res, next) => {
    try {
        const { role, userId } = req.user;
        const { templateId, targetUserId, customizations } = req.body;

        // Validate inputs
        if (!templateId) {
            throw new ApiError(400, 'Template ID is required');
        }

        // Determine the target user
        const finalTargetUserId = targetUserId || userId;

        // Only nutritionists can create meal plans for other users
        if (role !== 'nutritionist' && role !== 'admin' && finalTargetUserId !== userId) {
            throw new ApiError(403, 'You can only create meal plans for yourself');
        }

        // Create meal plan from template
        const mealPlan = await mealPlanService.createMealPlanFromTemplate(
            templateId,
            finalTargetUserId,
            role === 'nutritionist' ? userId : null,
            customizations || {}
        );

        res.status(201).json({
            message: 'Meal plan created from template successfully',
            mealPlan
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get a meal plan by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getMealPlan = async (req, res, next) => {
    try {
        const { role, userId } = req.user;
        const { id } = req.params;

        // Get meal plan
        const mealPlan = await mealPlanService.getMealPlanById(id);

        // Authorization check: Users can only access their own meal plans
        // Nutritionists can access their created plans, admins can access all
        if (
            role !== 'admin' &&
            mealPlan.userId !== userId &&
            (role !== 'nutritionist' || mealPlan.nutritionistId !== userId)
        ) {
            throw new ApiError(403, 'You do not have permission to access this meal plan');
        }

        res.status(200).json({ mealPlan });
    } catch (error) {
        next(error);
    }
}

/**
 * Get user's meal plans
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getUserMealPlans = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { active, limit, offset } = req.query;

        // Parse query parameters
        const options = {
            active: active === 'true',
            limit: limit ? parseInt(limit, 10) : 10,
            offset: offset ? parseInt(offset, 10) : 0
        };

        // Get user meal plans
        const mealPlans = await mealPlanService.getUserMealPlans(userId, options);

        res.status(200).json(mealPlans);
    } catch (error) {
        next(error);
    }
}

/**
 * Get nutritionist's created meal plans
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getNutritionistMealPlans = async (req, res, next) => {
    try {
        const { userId, role } = req.user;

        // Only nutritionists and admins can access this endpoint
        if (role !== 'nutritionist' && role !== 'admin') {
            throw new ApiError(403, 'Not authorized to access nutritionist meal plans');
        }

        const { active, userId: clientId, limit, offset } = req.query;

        // Parse query parameters
        const options = {
            active: active === 'true' ? true : undefined,
            userId: clientId,
            limit: limit ? parseInt(limit, 10) : 10,
            offset: offset ? parseInt(offset, 10) : 0
        };

        // Get nutritionist meal plans
        const mealPlans = await mealPlanService.getNutritionistMealPlans(
            role === 'nutritionist' ? userId : req.params.nutritionistId,
            options
        );

        res.status(200).json(mealPlans);
    } catch (error) {
        next(error);
    }
}

/**
 * Update a meal plan
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateMealPlan = async (req, res, next) => {
    try {
        const { role, userId } = req.user;
        const { id } = req.params;
        const updateData = req.body;

        // Get meal plan to check permissions
        const mealPlan = await mealPlanService.getMealPlanById(id);

        // Authorization check
        if (
            role !== 'admin' &&
            (role !== 'nutritionist' || mealPlan.nutritionistId !== userId) &&
            mealPlan.userId !== userId
        ) {
            throw new ApiError(403, 'You do not have permission to update this meal plan');
        }

        // Update meal plan
        const updatedMealPlan = await mealPlanService.updateMealPlan(id, updateData);

        res.status(200).json({
            message: 'Meal plan updated successfully',
            mealPlan: updatedMealPlan
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Add meals to a meal plan
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const addMealsToPlan = async (req, res, next) => {
    try {
        const { role, userId } = req.user;
        const { id } = req.params;
        const { meals } = req.body;

        // Validate meals
        if (!meals || !Array.isArray(meals) || meals.length === 0) {
            throw new ApiError(400, 'Meals must be provided as an array');
        }

        // Get meal plan to check permissions
        const mealPlan = await mealPlanService.getMealPlanById(id);

        // Authorization check
        if (
            role !== 'admin' &&
            (role !== 'nutritionist' || mealPlan.nutritionistId !== userId)
        ) {
            throw new ApiError(403, 'Only nutritionists and admins can add meals to meal plans');
        }

        // Add meals to plan
        const addedMeals = await mealPlanService.addMealsToPlan(id, meals);

        res.status(201).json({
            message: 'Meals added to plan successfully',
            meals: addedMeals
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update a meal in a meal plan
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateMeal = async (req, res, next) => {
    try {
        const { role, userId } = req.user;
        const { mealId } = req.params;
        const updateData = req.body;

        // Validate meal data
        const validationErrors = validateMeal(updateData);
        if (validationErrors.length > 0) {
            throw new ApiError(400, 'Validation error', validationErrors);
        }

        // Update meal
        const updatedMeal = await mealPlanService.updateMeal(mealId, updateData);

        res.status(200).json({
            message: 'Meal updated successfully',
            meal: updatedMeal
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete a meal from a meal plan
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteMeal = async (req, res, next) => {
    try {
        const { role, userId } = req.user;
        const { mealId } = req.params;

        // Delete meal
        await mealPlanService.deleteMeal(mealId);

        res.status(200).json({
            message: 'Meal deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get recommended meal plans for user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getRecommendedMealPlans = async (req, res, next) => {
    try {
        const { userId } = req.user;

        // Get recommended meal plans
        const recommendedPlans = await mealPlanService.getRecommendedMealPlans(userId);

        res.status(200).json({
            recommendedPlans
        });
    } catch (error) {
        next(error);
    }
}


module.exports = {
    createMealPlan,
    createFromTemplate,
    getMealPlan,
    getUserMealPlans,
    getNutritionistMealPlans,
    updateMealPlan,
    addMealsToPlan,
    updateMeal,
    deleteMeal,
    getRecommendedMealPlans
};