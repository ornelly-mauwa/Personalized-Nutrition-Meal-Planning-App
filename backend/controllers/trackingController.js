// trackingController.js
import userProfile from '../models/index.js';
import { Op } from 'sequelize';

const { MealLog, Profile } = userProfile
// controllers/trackingController.js


export const getDailySummary = async (req, res) => {
    const { userId } = req.params;
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: 'Missing required query parameter: date' });
    }

    try {
        const logs = await MealLog.findAll({
            where: { userId, date }
        });

        const total = logs.reduce((sum, meal) => {
            sum.calories += meal.calories || 0;
            sum.protein += meal.protein || 0;
            sum.carbs += meal.carbs || 0;
            sum.fats += meal.fats || 0;
            return sum;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

        res.json({ date, total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
};


function getCompliance(goal, actual) {
    if (!goal || goal === 0) return null;
    const diff = Math.abs(goal - actual);
    return ((goal - diff) / goal) * 100;
}
export const getWeeklySummary = async (req, res) => {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    try {
        const logs = await MealLog.findAll({
            where: {
                userId,
                date: {
                    [Op.between]: [new Date(startDate), new Date(endDate)],
                },
            },
            order: [['date', 'ASC']]
        });

        const weeklyTotals = logs.reduce((acc, meal) => {
            acc.calories += meal.calories;
            acc.protein += meal.protein;
            acc.carbs += meal.carbs;
            acc.fats += meal.fats;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

        const profile = await Profile.findOne({ where: { userId } });

        const compliance = {
            calories: getCompliance(profile.goalCalories, weeklyTotals.calories),
            protein: getCompliance(profile.goalProtein, weeklyTotals.protein),
            carbs: getCompliance(profile.goalCarbs, weeklyTotals.carbs),
            fats: getCompliance(profile.goalFats, weeklyTotals.fats)
        };

        return res.json({ totals: weeklyTotals, compliance });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch weekly summary' });
    }
}; 