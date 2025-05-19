
// controllers/trackingController.js
const { ValidationError } = require('sequelize');
const { MealLog, WeightLog, UserMealPlan, UserHealthProfile } = require('../models');
const { validateMealLog, validateWeightLog } = require('../utils/validation');

/**
 * Controller for handling all tracking related operations
 */

/**
 * Log a meal that the user has consumed
 */
const logMeal = async (req, res) => {
    try {
        const { error } = validateMealLog(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const userId = req.user.id;
        const { mealTypeId, items, date, notes } = req.body;

        // Create the meal log
        const mealLog = await MealLog.create({
            userId,
            mealTypeId,
            date: date || new Date(),
            notes
        });

        // Add items to the meal log (assuming items is an array of food items with quantities)
        if (items && items.length > 0) {
            // This implementation would depend on how you've structured your MealLogItem model
            // For now, we'll assume a simple structure
            for (const item of items) {
                await mealLog.addItem(item.foodItemId, {
                    through: { quantity: item.quantity, unit: item.unit }
                });
            }
        }

        return res.status(201).json({
            message: 'Meal logged successfully',
            mealLog
        });
    } catch (error) {
        console.error('Error logging meal:', error);
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Failed to log meal' });
    }
}

/**
 * Get all meal logs for the current user
 */
const getMealLogs = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        const where = { userId };

        // Add date filters if provided
        if (startDate && endDate) {
            where.date = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        } else if (startDate) {
            where.date = {
                [Op.gte]: new Date(startDate)
            };
        } else if (endDate) {
            where.date = {
                [Op.lte]: new Date(endDate)
            };
        }

        const mealLogs = await MealLog.findAll({
            where,
            include: [
                {
                    model: MealLogItem,
                    include: [FoodItem]
                },
                {
                    model: MealType
                }
            ],
            order: [['date', 'DESC']]
        });

        return res.json(mealLogs);
    } catch (error) {
        console.error('Error getting meal logs:', error);
        return res.status(500).json({ message: 'Failed to retrieve meal logs' });
    }
}

/**
 * Log user's weight
 */
const logWeight = async (req, res) => {
    try {
        const { error } = validateWeightLog(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const userId = req.user.id;
        const { weight, date, notes } = req.body;

        const weightLog = await WeightLog.create({
            userId,
            weight,
            date: date || new Date(),
            notes
        });

        // Update the user's current weight in their health profile
        await UserHealthProfile.update(
            { currentWeight: weight },
            { where: { userId } }
        );

        return res.status(201).json({
            message: 'Weight logged successfully',
            weightLog
        });
    } catch (error) {
        console.error('Error logging weight:', error);
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Failed to log weight' });
    }
}

/**
 * Get weight history for the current user
 */
const getWeightHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        const where = { userId };

        // Add date filters if provided
        if (startDate && endDate) {
            where.date = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        } else if (startDate) {
            where.date = {
                [Op.gte]: new Date(startDate)
            };
        } else if (endDate) {
            where.date = {
                [Op.lte]: new Date(endDate)
            };
        }

        const weightLogs = await WeightLog.findAll({
            where,
            order: [['date', 'DESC']]
        });

        return res.json(weightLogs);
    } catch (error) {
        console.error('Error getting weight history:', error);
        return res.status(500).json({ message: 'Failed to retrieve weight history' });
    }
}

/**
 * Get progress summary for the user
 */
const getProgressSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user's health profile
        const healthProfile = await UserHealthProfile.findOne({
            where: { userId }
        });

        if (!healthProfile) {
            return res.status(404).json({ message: 'Health profile not found' });
        }

        // Get user's current meal plan
        const currentMealPlan = await UserMealPlan.findOne({
            where: {
                userId,
                endDate: {
                    [Op.gte]: new Date()
                },
                startDate: {
                    [Op.lte]: new Date()
                }
            },
            include: ['meals']
        });

        // Get recent weight logs (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const weightLogs = await WeightLog.findAll({
            where: {
                userId,
                date: {
                    [Op.gte]: thirtyDaysAgo
                }
            },
            order: [['date', 'ASC']]
        });

        // Get meal logs for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const mealLogs = await MealLog.findAll({
            where: {
                userId,
                date: {
                    [Op.gte]: sevenDaysAgo
                }
            },
            include: [
                {
                    model: MealLogItem,
                    include: [FoodItem]
                }
            ],
            order: [['date', 'ASC']]
        });

        // Calculate progress metrics
        const progress = {
            startWeight: healthProfile.startingWeight,
            currentWeight: healthProfile.currentWeight,
            targetWeight: healthProfile.targetWeight,
            weightChange: healthProfile.currentWeight - healthProfile.startingWeight,
            weightToTarget: healthProfile.currentWeight - healthProfile.targetWeight,
            weightHistory: weightLogs.map(log => ({
                date: log.date,
                weight: log.weight
            })),
            recentMeals: mealLogs,
            mealPlanCompliance: null // This would require additional logic to calculate
        };

        // If there's a current meal plan, calculate compliance
        if (currentMealPlan) {
            // Logic for meal plan compliance calculation would go here
            // This would depend on your specific requirements
            progress.mealPlanCompliance = {
                planId: currentMealPlan.id,
                // other compliance metrics
            };
        }

        return res.json(progress);
    } catch (error) {
        console.error('Error getting progress summary:', error);
        return res.status(500).json({ message: 'Failed to retrieve progress summary' });
    }
}


module.exports = {
    logMeal,
    getMealLogs,
    logWeight,
    getWeightHistory,
    getProgressSummary
};
