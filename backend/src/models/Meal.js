const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    mealPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MealPlan',
        required: true
    },
    type: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    fats: {
        type: Number,
        required: true
    },
    ingredients: [{
        name: String,
        quantity: Number,
        unit: String
    }],
    instructions: [String],
    imageUrl: String,
    dayOfWeek: {
        type: Number,
        min: 0,
        max: 6,
        required: true
    }
}, {
    timestamps: true
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
