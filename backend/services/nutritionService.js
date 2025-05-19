const {
    MealLog,
    MealLogItem,
    WeightLog,
    FoodItem,
    UserHealthProfile,
    User,
    MealType
} = require('../models');
const { Op } = require('sequelize');

class NutritionService {
    // Calculate daily nutritional needs based on user's health profile
    async calculateDailyNeeds(healthProfile) {
        try {
            const { age, gender, height, weight, activityLevel, goal } = healthProfile;

            // Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
            let bmr;
            if (gender === 'male') {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            } else {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }

            // Activity level multipliers
            const activityMultipliers = {
                'sedentary': 1.2,
                'light': 1.375,
                'moderate': 1.55,
                'active': 1.725,
                'very_active': 1.9
            };

            // Total Daily Energy Expenditure (TDEE)
            const tdee = bmr * activityMultipliers[activityLevel];

            // Adjust calories based on goal
            let targetCalories;
            switch (goal) {
                case 'lose_weight':
                    targetCalories = tdee - 500; // 500 calorie deficit for ~1lb/week loss
                    break;
                case 'gain_weight':
                    targetCalories = tdee + 500; // 500 calorie surplus for ~1lb/week gain
                    break;
                case 'build_muscle':
                    targetCalories = tdee + 300; // Moderate surplus for muscle building
                    break;
                default:
                    targetCalories = tdee; // Maintenance
            }

            // Calculate macronutrient targets
            const protein = this.calculateProteinNeeds(weight, goal);
            const fats = targetCalories * 0.25 / 9; // 25% of calories from fats (9 cal/g)
            const carbs = (targetCalories - (protein * 4) - (fats * 9)) / 4; // Remaining calories from carbs (4 cal/g)

            return {
                calories: Math.round(targetCalories),
                protein: Math.round(protein),
                carbs: Math.round(carbs),
                fats: Math.round(fats),
                bmr: Math.round(bmr),
                tdee: Math.round(tdee)
            };
        } catch (error) {
            throw new Error(`Failed to calculate daily needs: ${error.message}`);
        }
    }

    // Calculate protein needs based on weight and goal
    calculateProteinNeeds(weight, goal) {
        const proteinMultipliers = {
            'lose_weight': 2.2, // Higher protein for muscle preservation
            'gain_weight': 1.8,
            'build_muscle': 2.0,
            'maintain_weight': 1.6
        };

        return weight * (proteinMultipliers[goal] || 1.6);
    }

    // Log a meal
    async logMeal(userId, mealData) {
        try {
            const { mealTypeId, consumedAt, foodItems, notes } = mealData;

            // Create meal log entry
            const mealLog = await MealLog.create({
                userId,
                mealTypeId,
                consumedAt: consumedAt || new Date(),
                notes
            });

            // Add food items to the meal log
            for (const item of foodItems) {
                await MealLogItem.create({
                    mealLogId: mealLog.id,
                    foodItemId: item.foodItemId,
                    quantity: item.quantity,
                    unit: item.unit
                });
            }

            // Calculate and update meal nutrition
            const nutrition = await this.calculateMealNutrition(mealLog.id);
            await mealLog.update({
                totalCalories: nutrition.calories,
                totalProtein: nutrition.protein,
                totalCarbs: nutrition.carbs,
                totalFats: nutrition.fats
            });

            return await this.getMealLogById(mealLog.id);
        } catch (error) {
            throw new Error(`Failed to log meal: ${error.message}`);
        }
    }

    // Get meal logs for a user
    async getMealLogs(userId, filters = {}) {
        try {
            const whereClause = { userId };

            if (filters.startDate && filters.endDate) {
                whereClause.consumedAt = {
                    [Op.between]: [filters.startDate, filters.endDate]
                };
            }

            if (filters.mealTypeId) {
                whereClause.mealTypeId = filters.mealTypeId;
            }

            const limit = filters.limit || 50;
            const offset = filters.offset || 0;

            return await MealLog.findAndCountAll({
                where: whereClause,
                include: [
                    { model: MealType },
                    {
                        model: MealLogItem,
                        include: [{ model: FoodItem }]
                    }
                ],
                order: [['consumedAt', 'DESC']],
                limit,
                offset
            });
        } catch (error) {
            throw new Error(`Failed to fetch meal logs: ${error.message}`);
        }
    }

    // Get meal log by ID
    async getMealLogById(mealLogId) {
        try {
            const mealLog = await MealLog.findByPk(mealLogId, {
                include: [
                    { model: MealType },
                    {
                        model: MealLogItem,
                        include: [{ model: FoodItem }]
                    }
                ]
            });

            if (!mealLog) {
                throw new Error('Meal log not found');
            }

            return mealLog;
        } catch (error) {
            throw new Error(`Failed to fetch meal log: ${error.message}`);
        }
    }

    // Calculate nutrition for a specific meal log
    async calculateMealNutrition(mealLogId) {
        try {
            const mealLog = await this.getMealLogById(mealLogId);

            let totalNutrition = {
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0,
                fiber: 0,
                sugar: 0
            };

            for (const item of mealLog.MealLogItems) {
                const foodItem = item.FoodItem;
                const quantity = item.quantity;

                // Convert quantity to grams for calculation
                const gramsQuantity = this.convertToGrams(quantity, item.unit);
                const multiplier = gramsQuantity / 100; // Since nutrition is per 100g

                totalNutrition.calories += foodItem.caloriesPer100g * multiplier;
                totalNutrition.protein += foodItem.proteinPer100g * multiplier;
                totalNutrition.carbs += foodItem.carbsPer100g * multiplier;
                totalNutrition.fats += foodItem.fatsPer100g * multiplier;
                totalNutrition.fiber += (foodItem.fiberPer100g || 0) * multiplier;
                totalNutrition.sugar += (foodItem.sugarPer100g || 0) * multiplier;
            }

            // Round to 2 decimal places
            for (const key in totalNutrition) {
                totalNutrition[key] = Math.round(totalNutrition[key] * 100) / 100;
            }

            return totalNutrition;
        } catch (error) {
            throw new Error(`Failed to calculate meal nutrition: ${error.message}`);
        }
    }

    // Log weight
    async logWeight(userId, weightData) {
        try {
            const { weight, loggedAt, notes } = weightData;

            return await WeightLog.create({
                userId,
                weight,
                loggedAt: loggedAt || new Date(),
                notes
            });
        } catch (error) {
            throw new Error(`Failed to log weight: ${error.message}`);
        }
    }

    // Get weight logs for a user
    async getWeightLogs(userId, filters = {}) {
        try {
            const whereClause = { userId };

            if (filters.startDate && filters.endDate) {
                whereClause.loggedAt = {
                    [Op.between]: [filters.startDate, filters.endDate]
                };
            }

            const limit = filters.limit || 100;
            const offset = filters.offset || 0;

            return await WeightLog.findAndCountAll({
                where: whereClause,
                order: [['loggedAt', 'DESC']],
                limit,
                offset
            });
        } catch (error) {
            throw new Error(`Failed to fetch weight logs: ${error.message}`);
        }
    }

    // Get daily nutrition summary
    async getDailyNutritionSummary(userId, date) {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const mealLogs = await MealLog.findAll({
                where: {
                    userId,
                    consumedAt: {
                        [Op.between]: [startOfDay, endOfDay]
                    }
                },
                include: [
                    { model: MealType },
                    {
                        model: MealLogItem,
                        include: [{ model: FoodItem }]
                    }
                ]
            });

            let dailyNutrition = {
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFats: 0,
                totalFiber: 0,
                totalSugar: 0,
                mealBreakdown: {}
            };

            for (const mealLog of mealLogs) {
                const mealType = mealLog.MealType.name;

                if (!dailyNutrition.mealBreakdown[mealType]) {
                    dailyNutrition.mealBreakdown[mealType] = {
                        calories: 0,
                        protein: 0,
                        carbs: 0,
                        fats: 0,
                        fiber: 0,
                        sugar: 0
                    };
                }

                // Add to daily totals
                dailyNutrition.totalCalories += mealLog.totalCalories || 0;
                dailyNutrition.totalProtein += mealLog.totalProtein || 0;
                dailyNutrition.totalCarbs += mealLog.totalCarbs || 0;
                dailyNutrition.totalFats += mealLog.totalFats || 0;

                // Add to meal breakdown
                const mealNutrition = await this.calculateMealNutrition(mealLog.id);
                dailyNutrition.mealBreakdown[mealType].calories += mealNutrition.calories;
                dailyNutrition.mealBreakdown[mealType].protein += mealNutrition.protein;
                dailyNutrition.mealBreakdown[mealType].carbs += mealNutrition.carbs;
                dailyNutrition.mealBreakdown[mealType].fats += mealNutrition.fats;
                dailyNutrition.mealBreakdown[mealType].fiber += mealNutrition.fiber;
                dailyNutrition.mealBreakdown[mealType].sugar += mealNutrition.sugar;

                dailyNutrition.totalFiber += mealNutrition.fiber;
                dailyNutrition.totalSugar += mealNutrition.sugar;
            }

            // Round all values
            for (const key in dailyNutrition) {
                if (typeof dailyNutrition[key] === 'number') {
                    dailyNutrition[key] = Math.round(dailyNutrition[key] * 100) / 100;
                }
            }

            for (const mealType in dailyNutrition.mealBreakdown) {
                for (const nutrient in dailyNutrition.mealBreakdown[mealType]) {
                    dailyNutrition.mealBreakdown[mealType][nutrient] =
                        Math.round(dailyNutrition.mealBreakdown[mealType][nutrient] * 100) / 100;
                }
            }

            return dailyNutrition;
        } catch (error) {
            throw new Error(`Failed to get daily nutrition summary: ${error.message}`);
        }
    }

    // Get progress summary for a user
    async getProgressSummary(userId, filters = {}) {
        try {
            const user = await User.findByPk(userId, {
                include: [{ model: UserHealthProfile }]
            });

            if (!user || !user.UserHealthProfile) {
                throw new Error('User health profile not found');
            }

            const healthProfile = user.UserHealthProfile;
            const targetNutrition = await this.calculateDailyNeeds(healthProfile);

            // Default to last 30 days if no date range provided
            const endDate = filters.endDate || new Date();
            const startDate = filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

            // Get daily nutrition summaries for the period
            const dailySummaries = [];
            const currentDate = new Date(startDate);

            while (currentDate <= endDate) {
                const dailySummary = await this.getDailyNutritionSummary(userId, currentDate);
                dailySummaries.push({
                    date: new Date(currentDate),
                    ...dailySummary
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Calculate averages
            const averages = {
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0
            };

            const daysWithData = dailySummaries.filter(day => day.totalCalories > 0);

            if (daysWithData.length > 0) {
                for (const day of daysWithData) {
                    averages.calories += day.totalCalories;
                    averages.protein += day.totalProtein;
                    averages.carbs += day.totalCarbs;
                    averages.fats += day.totalFats;
                }

                averages.calories = Math.round(averages.calories / daysWithData.length);
                averages.protein = Math.round(averages.protein / daysWithData.length);
                averages.carbs = Math.round(averages.carbs / daysWithData.length);
                averages.fats = Math.round(averages.fats / daysWithData.length);
            }

            // Get weight progress
            const weightLogs = await this.getWeightLogs(userId, { startDate, endDate });
            const weightProgress = {
                currentWeight: weightLogs.rows.length > 0 ? weightLogs.rows[0].weight : healthProfile.weight,
                startWeight: weightLogs.rows.length > 0 ? weightLogs.rows[weightLogs.rows.length - 1].weight : healthProfile.weight,
                weightChange: 0,
                trend: 'stable'
            };

            if (weightLogs.rows.length > 1) {
                weightProgress.weightChange = weightProgress.currentWeight - weightProgress.startWeight;
                weightProgress.trend = weightProgress.weightChange > 1 ? 'gaining' :
                    weightProgress.weightChange < -1 ? 'losing' : 'stable';
            }

            // Calculate compliance with targets
            const compliance = {
                calories: averages.calories > 0 ? Math.round((averages.calories / targetNutrition.calories) * 100) : 0,
                protein: averages.protein > 0 ? Math.round((averages.protein / targetNutrition.protein) * 100) : 0,
                carbs: averages.carbs > 0 ? Math.round((averages.carbs / targetNutrition.carbs) * 100) : 0,
                fats: averages.fats > 0 ? Math.round((averages.fats / targetNutrition.fats) * 100) : 0
            };

            return {
                period: {
                    startDate,
                    endDate,
                    daysTracked: daysWithData.length,
                    totalDays: dailySummaries.length
                },
                targets: targetNutrition,
                averages,
                compliance,
                weightProgress,
                dailySummaries
            };
        } catch (error) {
            throw new Error(`Failed to get progress summary: ${error.message}`);
        }
    }

    // Get nutrition analytics for nutritionist/admin
    async getNutritionAnalytics(filters = {}) {
        try {
            const whereClause = {};

            if (filters.userId) {
                whereClause.userId = filters.userId;
            }

            if (filters.startDate && filters.endDate) {
                whereClause.consumedAt = {
                    [Op.between]: [filters.startDate, filters.endDate]
                };
            }

            const mealLogs = await MealLog.findAll({
                where: whereClause,
                attributes: [
                    [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'totalMeals'],
                    [require('sequelize').fn('AVG', require('sequelize').col('totalCalories')), 'avgCalories'],
                    [require('sequelize').fn('AVG', require('sequelize').col('totalProtein')), 'avgProtein'],
                    [require('sequelize').fn('AVG', require('sequelize').col('totalCarbs')), 'avgCarbs'],
                    [require('sequelize').fn('AVG', require('sequelize').col('totalFats')), 'avgFats'],
                    [require('sequelize').fn('DATE', require('sequelize').col('consumedAt')), 'date']
                ],
                group: [require('sequelize').fn('DATE', require('sequelize').col('consumedAt'))],
                order: [[require('sequelize').fn('DATE', require('sequelize').col('consumedAt')), 'DESC']],
                raw: true
            });

            const totalUsers = await User.count({
                include: [{
                    model: MealLog,
                    where: whereClause,
                    attributes: []
                }],
                distinct: true
            });

            return {
                totalUsers,
                dailyStats: mealLogs
            };
        } catch (error) {
            throw new Error(`Failed to get nutrition analytics: ${error.message}`);
        }
    }

    // Helper method to convert quantities to grams
    convertToGrams(quantity, unit) {
        const conversions = {
            'grams': 1,
            'ml': 1, // Assume 1ml = 1g for liquids
            'pieces': 100, // Default 100g per piece
            'cups': 240, // 1 cup = 240g
            'tablespoons': 15, // 1 tbsp = 15g
            'teaspoons': 5 // 1 tsp = 5g
        };
        return quantity * (conversions[unit] || 1);
    }

    // Update meal log
    async updateMealLog(mealLogId, updateData, userId) {
        try {
            const mealLog = await MealLog.findOne({
                where: { id: mealLogId, userId }
            });

            if (!mealLog) {
                throw new Error('Meal log not found or unauthorized');
            }

            await mealLog.update(updateData);

            // Recalculate nutrition if food items were updated
            if (updateData.foodItems) {
                // Delete existing items
                await MealLogItem.destroy({ where: { mealLogId } });

                // Add new items
                for (const item of updateData.foodItems) {
                    await MealLogItem.create({
                        mealLogId,
                        foodItemId: item.foodItemId,
                        quantity: item.quantity,
                        unit: item.unit
                    });
                }

                // Recalculate nutrition
                const nutrition = await this.calculateMealNutrition(mealLogId);
                await mealLog.update({
                    totalCalories: nutrition.calories,
                    totalProtein: nutrition.protein,
                    totalCarbs: nutrition.carbs,
                    totalFats: nutrition.fats
                });
            }

            return await this.getMealLogById(mealLogId);
        } catch (error) {
            throw new Error(`Failed to update meal log: ${error.message}`);
        }
    }

    // Delete meal log
    async deleteMealLog(mealLogId, userId) {
        try {
            const mealLog = await MealLog.findOne({
                where: { id: mealLogId, userId }
            });

            if (!mealLog) {
                throw new Error('Meal log not found or unauthorized');
            }

            await mealLog.destroy();
            return true;
        } catch (error) {
            throw new Error(`Failed to delete meal log: ${error.message}`);
        }
    }
}

module.exports = new NutritionService();