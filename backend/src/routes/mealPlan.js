const express = require('express');
const MealPlan = require('../models/MealPlan');
const Meal = require('../models/Meal');
const UserProfile = require('../models/UserProfile');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Nutritionist create a meal plan for a user
router.post('/', authenticate, authorize('nutritionist'), async (req, res) => {
    try {
        const {
            userId,
            name,
            startDate,
            endDate,
            dailyCalories,
            proteinTarget,
            carbsTarget,
            fatsTarget,
            meals
        } = req.body;

        // Check if the user exists
        const userProfile = await UserProfile.findOne({ userId });
        if (!userProfile) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Create the meal plan
        const mealPlan = new MealPlan({
            userId,
            nutritionistId: req.user._id,
            name,
            startDate,
            endDate,
            dailyCalories,
            proteinTarget,
            carbsTarget,
            fatsTarget
        });

        await mealPlan.save();

        // Create meals for the meal plan
        if (meals && Array.isArray(meals)) {
            const mealPromises = meals.map(meal => {
                const newMeal = new Meal({
                    ...meal,
                    mealPlanId: mealPlan._id
                });
                return newMeal.save();
            });

            await Promise.all(mealPromises);
        }

        res.status(201).send({ mealPlan });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get meal plans created by a nutritionist
router.get('/by-nutritionist', authenticate, authorize('nutritionist'), async (req, res) => {
    try {
        const mealPlans = await MealPlan.find({ nutritionistId: req.user._id });
        res.send(mealPlans);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get meal plans assigned to a user
router.get('/my-plans', authenticate, authorize('user'), async (req, res) => {
    try {
        const mealPlans = await MealPlan.find({
            userId: req.user._id,
            status: 'active'
        });
        res.send(mealPlans);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get a specific meal plan with meals
router.get('/:id', authenticate, async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id);

        if (!mealPlan) {
            return res.status(404).send({ error: 'Meal plan not found' });
        }

        // Check authorization
        if (
            req.user.role !== 'admin' &&
            mealPlan.userId.toString() !== req.user._id.toString() &&
            mealPlan.nutritionistId.toString() !== req.user._id.toString()
        ) {
            return res.status(403).send({ error: 'Access denied' });
        }

        // Get meals associated with this plan
        const meals = await Meal.find({ mealPlanId: mealPlan._id });

        res.send({ mealPlan, meals });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Update a meal plan
router.patch('/:id', authenticate, authorize(['nutritionist', 'admin']), async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id);

        if (!mealPlan) {
            return res.status(404).send({ error: 'Meal plan not found' });
        }

        // Check if the nutritionist is the creator
        if (
            req.user.role !== 'admin' &&
            mealPlan.nutritionistId.toString() !== req.user._id.toString()
        ) {
            return res.status(403).send({ error: 'Access denied' });
        }

        // Update fields
        const updates = req.body;
        const allowedUpdates = [
            'name', 'startDate', 'endDate', 'dailyCalories',
            'proteinTarget', 'carbsTarget', 'fatsTarget', 'status'
        ];

        const isValidOperation = Object.keys(updates).every(update =>
            allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates' });
        }

        Object.keys(updates).forEach(update => {
            mealPlan[update] = updates[update];
        });

        await mealPlan.save();
        res.send(mealPlan);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Add or update meals in a meal plan
router.post('/:id/meals', authenticate, authorize('nutritionist'), async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id);

        if (!mealPlan) {
            return res.status(404).send({ error: 'Meal plan not found' });
        }

        // Check if the nutritionist is the creator
        if (mealPlan.nutritionistId.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'Access denied' });
        }

        const { meals } = req.body;

        if (!meals || !Array.isArray(meals)) {
            return res.status(400).send({ error: 'Invalid meals data' });
        }

        const mealPromises = meals.map(meal => {
            if (meal._id) {
                // Update existing meal
                return Meal.findByIdAndUpdate(
                    meal._id,
                    { ...meal, mealPlanId: mealPlan._id },
                    { new: true }
                );
            } else {
                // Create new meal
                const newMeal = new Meal({
                    ...meal,
                    mealPlanId: mealPlan._id
                });
                return newMeal.save();
            }
        });

        const updatedMeals = await Promise.all(mealPromises);
        res.send(updatedMeals);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;