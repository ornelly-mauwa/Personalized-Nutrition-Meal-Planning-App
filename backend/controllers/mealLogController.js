import models from '../models/index.js';

const { MealLog } = models;

export const logMeal = async (req, res) => {
    const { userId, date, mealType, name, calories, protein, carbs, fats } = req.body;

    try {
        const mealLog = await MealLog.create({
            userId,
            date,
            mealType,
            name,
            calories,
            protein,
            carbs,
            fats,
        });

        res.status(201).json(mealLog);
    } catch (error) {
        console.error('Error logging meal:', error);
        res.status(500).json({ error: 'Failed to log meal' });
    }
};

export const getDailyMeals = async (req, res) => {
    const { userId } = req.params;
    //const { date } = req.query;

    try {
        const logs = await MealLog.findAll({
            where: { userId },
            order: [['mealType', 'ASC']],
        });

        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching meal logs:', error);
        res.status(500).json({ error: error.message });
    }
};
export const getWeeklyMeals = async (req, res) => {
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
            order: [['date', 'ASC'], ['mealType', 'ASC']],
        });

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weekly meals' });
    }
};

export const updateMealLog = async (req, res) => {
    const { id } = req.params;
    const { mealType, name, calories, protein, carbs, fats } = req.body;

    try {
        const log = await MealLog.findByPk(id);

        if (!log) {
            return res.status(404).json({ error: 'Meal log not found' });
        }

        await log.update({ mealType, name, calories, protein, carbs, fats });

        res.status(200).json(log);
    } catch (error) {
        console.error('Error updating meal log:', error);
        res.status(500).json({ error: 'Failed to update meal log' });
    }
};

// ❌ Delete a meal log by ID
export const deleteMealLog = async (req, res) => {
    const { id } = req.params;

    try {
        const log = await MealLog.findByPk(id);

        if (!log) {
            return res.status(404).json({ error: 'Meal log not found' });
        }

        await log.destroy();

        res.status(200).json({ message: 'Meal log deleted successfully' });
    } catch (error) {
        console.error('Error deleting meal log:', error);
        res.status(500).json({ error: 'Failed to delete meal log' });
    }
};