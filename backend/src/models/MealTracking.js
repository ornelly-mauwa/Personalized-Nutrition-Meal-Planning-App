const mongoose = require('mongoose');

const mealTrackingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mealPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MealPlan',
        required: true
    },
    mealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal'
    },
    consumedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    completed: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    actualCalories: {
        type: Number,
        required: true
    },
    actualProtein: {
        type: Number,
        required: true
    },
    actualCarbs: {
        type: Number,
        required: true
    },
    actualFats: {
        type: Number,
        required: true
    },
    notes: String,
    imageUrl: String
}, {
    timestamps: true
});

const MealTracking = mongoose.model('MealTracking', mealTrackingSchema);

module.exports = MealTracking;