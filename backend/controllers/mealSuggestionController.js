import models from '../models/index.js';
const { Meal, Profile } = models;

const getSafeMeals = async (req, res) => {
    const { userId } = req.params;

    try {
        const profile = await Profile.findOne({ where: { userId } });
        if (!profile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        const allergies = profile.allergies || [];

        const meals = await Meal.findAll();

        const safeMeals = meals.filter(meal => {
            return !allergies.some(allergen =>
                meal.ingredients?.toLowerCase().includes(allergen.toLowerCase())
            );
        });

        res.json(safeMeals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch safe meals' });
    }
};

export default getSafeMeals;