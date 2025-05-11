const express = require('express');
const MealTracking = require('../models/MealTracking');
const WeightTracking = require('../models/weightTracking');
const MealPlan = require('../models/MealPlan');
const Meal = require('../models/Meal');
const { authenticate, authorize } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// Log a meal (from plan or custom)
router.post('/meals', authenticate, authorize('user'), async (req, res) => {
    try {
        const {
            mealPlanId,
            mealId,
            type,
            name,
            consumedAt,
            actualCalories,
            actualProtein,
            actualCarbs,
            actualFats,
            notes,
            imageUrl
        } = req.body;

        // Check if meal plan exists and belongs to the user
        if (mealPlanId) {
            const mealPlan = await MealPlan.findOne({
                _id: mealPlanId,
                userId: req.user._id
            });

            if (!mealPlan) {
                return res.status(404).send({ error: 'Meal plan not found or unauthorized' });
            }
        }

        // Create the meal tracking record
        const mealTracking = new MealTracking({
            userId: req.user._id,
            mealPlanId,
            mealId,
            type,
            name,
            consumedAt: consumedAt || new Date(),
            actualCalories,
            actualProtein,
            actualCarbs,
            actualFats,
            notes,
            imageUrl
        });

        await mealTracking.save();
        res.status(201).send(mealTracking);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Log a meal directly from the meal plan
router.post('/meals/from-plan', authenticate, authorize('user'), async (req, res) => {
    try {
        const { mealId, notes, completed } = req.body;

        // Find the meal
        const meal = await Meal.findById(mealId);
        if (!meal) {
            return res.status(404).send({ error: 'Meal not found' });
        }

        // Check if meal plan exists and belongs to the user
        const mealPlan = await MealPlan.findOne({
            _id: meal.mealPlanId,
            userId: req.user._id
        });

        if (!mealPlan) {
            return res.status(404).send({ error: 'Meal plan not found or unauthorized' });
        }

        // Create the meal tracking record
        const mealTracking = new MealTracking({
            userId: req.user._id,
            mealPlanId: meal.mealPlanId,
            mealId: meal._id,
            type: meal.type,
            name: meal.name,
            consumedAt: new Date(),
            completed: completed !== undefined ? completed : true,
            actualCalories: meal.calories,
            actualProtein: meal.protein,
            actualCarbs: meal.carbs,
            actualFats: meal.fats,
            notes
        });

        await mealTracking.save();
        res.status(201).send(mealTracking);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get daily meal tracking
router.get('/meals/daily', authenticate, authorize('user'), async (req, res) => {
    try {
        const date = req.query.date ? new Date(req.query.date) : new Date();
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const mealTrackings = await MealTracking.find({
            userId: req.user._id,
            consumedAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({ consumedAt: 1 });

        // Calculate daily totals
        const totals = mealTrackings.reduce((acc, meal) => {
            acc.calories += meal.actualCalories;
            acc.protein += meal.actualProtein;
            acc.carbs += meal.actualCarbs;
            acc.fats += meal.actualFats;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

        res.send({ mealTrackings, totals });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get weekly meal tracking summary
router.get('/meals/weekly', authenticate, authorize('user'), async (req, res) => {
    try {
        const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6); // 7 days including end date

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const mealTrackings = await MealTracking.find({
            userId: req.user._id,
            consumedAt: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // Group by day
        const dailyData = {};
        const days = [];

        // Initialize days
        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(day.getDate() + i);
            const dateStr = day.toISOString().split('T')[0];
            days.push(dateStr);
            dailyData[dateStr] = {
                date: dateStr,
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0,
                mealCount: 0
            };
        }

        // Populate with data
        mealTrackings.forEach(meal => {
            const dateStr = meal.consumedAt.toISOString().split('T')[0];
            if (dailyData[dateStr]) {
                dailyData[dateStr].calories += meal.actualCalories;
                dailyData[dateStr].protein += meal.actualProtein;
                dailyData[dateStr].carbs += meal.actualCarbs;
                dailyData[dateStr].fats += meal.actualFats;
                dailyData[dateStr].mealCount += 1;
            }
        });

        // Convert to array
        const summary = days.map(day => dailyData[day]);

        // Calculate weekly totals and averages
        const totals = summary.reduce((acc, day) => {
            acc.calories += day.calories;
            acc.protein += day.protein;
            acc.carbs += day.carbs;
            acc.fats += day.fats;
            acc.mealCount += day.mealCount;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0, mealCount: 0 });

        const averages = {
            calories: Math.round(totals.calories / 7),
            protein: Math.round(totals.protein / 7),
            carbs: Math.round(totals.carbs / 7),
            fats: Math.round(totals.fats / 7)
        };

        res.send({ summary, totals, averages });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Log weight
router.post('/weight', authenticate, authorize('user'), async (req, res) => {
    try {
        const { weight, recordedAt, notes } = req.body;

        const weightTracking = new WeightTracking({
            userId: req.user._id,
            weight,
            recordedAt: recordedAt || new Date(),
            notes
        });

        await weightTracking.save();
        res.status(201).send(weightTracking);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get weight history
router.get('/weight/history', authenticate, authorize('user'), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = { userId: req.user._id };

        if (startDate || endDate) {
            query.recordedAt = {};
            if (startDate) query.recordedAt.$gte = new Date(startDate);
            if (endDate) query.recordedAt.$lte = new Date(endDate);
        }

        const weightHistory = await WeightTracking.find(query)
            .sort({ recordedAt: 1 });

        res.send(weightHistory);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get compliance report (comparison between planned and actual)
router.get('/compliance', authenticate, authorize(['user', 'nutritionist']), async (req, res) => {
    try {
        const { userId, mealPlanId, startDate, endDate } = req.query;

        // Check authorization
        const targetUserId = userId || req.user._id;
        if (req.user.role === 'user' && req.user._id.toString() !== targetUserId.toString()) {
            return res.status(403).send({ error: 'Unauthorized access' });
        }

        if (req.user.role === 'nutritionist') {
            // Check if nutritionist has created a meal plan for this user
            const mealPlan = await MealPlan.findOne({
                nutritionistId: req.user._id,
                userId: targetUserId
            });

            if (!mealPlan) {
                return res.status(403).send({ error: 'Unauthorized access' });
            }
        }

        // Set date range
        const start = startDate ? new Date(startDate) : new Date();
        start.setDate(start.getDate() - 7); // Default to last 7 days
        start.setHours(0, 0, 0, 0);

        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        // Query conditions
        const queryConditions = {
            userId: targetUserId,
            consumedAt: { $gte: start, $lte: end }
        };

        if (mealPlanId) {
            queryConditions.mealPlanId = mealPlanId;
        }

        // Get tracked meals
        const trackedMeals = await MealTracking.find(queryConditions);

        // Get meal plans that were active during this period
        const activeMealPlans = await MealPlan.find({
            userId: targetUserId,
            status: 'active',
            startDate: { $lte: end },
            endDate: { $gte: start }
        });

        // If a specific meal plan was requested, filter to just that one
        const relevantMealPlans = mealPlanId
            ? activeMealPlans.filter(plan => plan._id.toString() === mealPlanId)
            : activeMealPlans;

        // Get all meals from these plans
        const mealPlanIds = relevantMealPlans.map(plan => plan._id);
        const plannedMeals = await Meal.find({ mealPlanId: { $in: mealPlanIds } });

        // Calculate compliance statistics
        const totalTrackedMeals = trackedMeals.length;

        // For each day in the range, check what meals should have been eaten
        const daysInRange = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        // Simple calculation: # of unique days with at least one tracked meal
        const daysWithTracking = [...new Set(
            trackedMeals.map(meal => meal.consumedAt.toISOString().split('T')[0])
        )].length;

        const compliance = {
            daysInRange,
            daysWithTracking,
            dayComplianceRate: daysInRange > 0 ? (daysWithTracking / daysInRange) * 100 : 0,
            trackedMeals: totalTrackedMeals,
            averageTrackedMealsPerDay: daysInRange > 0 ? totalTrackedMeals / daysInRange : 0,
            calorieCompliance: 0,
            macroCompliance: 0
        };

        // If we have active meal plans, calculate more detailed compliance
        if (relevantMealPlans.length > 0) {
            // Calculate average daily targets from meal plans
            const avgDailyTargets = relevantMealPlans.reduce((acc, plan) => {
                acc.calories += plan.dailyCalories;
                acc.protein += plan.proteinTarget;
                acc.carbs += plan.carbsTarget;
                acc.fats += plan.fatsTarget;
                return acc;
            }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

            avgDailyTargets.calories /= relevantMealPlans.length;
            avgDailyTargets.protein /= relevantMealPlans.length;
            avgDailyTargets.carbs /= relevantMealPlans.length;
            avgDailyTargets.fats /= relevantMealPlans.length;

            // Group tracked meals by day
            const mealsByDay = {};
            trackedMeals.forEach(meal => {
                const dateStr = meal.consumedAt.toISOString().split('T')[0];
                if (!mealsByDay[dateStr]) {
                    mealsByDay[dateStr] = [];
                }
                mealsByDay[dateStr].push(meal);
            });

            // Calculate compliance for each day with tracking
            let totalCalorieCompliance = 0;
            let totalMacroCompliance = 0;
            let daysWithData = 0;

            Object.keys(mealsByDay).forEach(dateStr => {
                const dayMeals = mealsByDay[dateStr];
                const dayTotals = dayMeals.reduce((acc, meal) => {
                    acc.calories += meal.actualCalories;
                    acc.protein += meal.actualProtein;
                    acc.carbs += meal.actualCarbs;
                    acc.fats += meal.actualFats;
                    return acc;
                }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

                // Calculate calorie compliance (as percentage)
                const calorieCompliance = Math.min(100, (dayTotals.calories / avgDailyTargets.calories) * 100);

                // Calculate macro compliance (as average of the three macros)
                const proteinCompliance = Math.min(100, (dayTotals.protein / avgDailyTargets.protein) * 100);
                const carbsCompliance = Math.min(100, (dayTotals.carbs / avgDailyTargets.carbs) * 100);
                const fatsCompliance = Math.min(100, (dayTotals.fats / avgDailyTargets.fats) * 100);
                const macroCompliance = (proteinCompliance + carbsCompliance + fatsCompliance) / 3;

                totalCalorieCompliance += calorieCompliance;
                totalMacroCompliance += macroCompliance;
                daysWithData++;
            });

            if (daysWithData > 0) {
                compliance.calorieCompliance = totalCalorieCompliance / daysWithData;
                compliance.macroCompliance = totalMacroCompliance / daysWithData;
            }
        }

        res.send({
            compliance,
            trackedMeals,
            mealPlans: relevantMealPlans
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;