import models from '../models/index.js';

const { MealPlan, Meal, User } = models;

// controllers/mealPlanController.js

export const createMealPlan = async (req, res) => {
    const { userId, nutritionistId, startDate, endDate } = req.body;

    try {
        // Check if nutritionist exists and has the correct role
        const nutritionist = await User.findOne({
            where: { id: nutritionistId, role: 'nutritionist' },
        });
        if (!nutritionist) {
            return res.status(400).json({ error: 'Invalid nutritionist ID' });
        }

        // Check if target user exists and is a normal user
        const user = await User.findOne({
            where: { id: userId, role: 'user' },
        });
        if (!user) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Create the meal plan
        const mealPlan = await MealPlan.create({
            userId,
            nutritionistId,
            startDate,
            endDate,
        });

        return res.status(201).json(mealPlan);
    } catch (error) {
        console.error('Error creating meal plan:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


export const getUserMealPlan = async (req, res) => {
    const { userId } = req.params;

    try {
        const mealPlan = await MealPlan.findOne({
            where: { userId },
            include: [{ model: Meal, as: 'Meals' }],
            order: [['createdAt', 'DESC']],
        });

        if (!mealPlan) return res.status(404).json({ message: 'No meal plan found for user' });

        res.status(200).json(mealPlan);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve meal plan' });
    }
};


