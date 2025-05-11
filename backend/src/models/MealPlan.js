const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nutritionistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    dailyCalories: {
        type: Number,
        required: true
    },
    proteinTarget: {
        type: Number,
        required: true
    },
    carbsTarget: {
        type: Number,
        required: true
    },
    fatsTarget: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'archived'],
        default: 'active'
    }
}, {
    timestamps: true
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = MealPlan;