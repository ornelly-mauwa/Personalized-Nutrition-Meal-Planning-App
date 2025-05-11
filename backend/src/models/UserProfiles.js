const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    age: {
        type: Number,
        min: 10,
        max: 120
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },
    height: {
        type: Number
    },
    currentWeight: {
        type: Number
    },
    targetWeight: {
        type: Number
    },
    allergies: [String],
    dietaryRestrictions: [String],
    fitnessGoal: {
        type: String,
        enum: ['weight_loss', 'muscle_gain', 'maintenance', 'general_health']
    },
    activityLevel: {
        type: Number,
        min: 1,
        max: 5
    }
}, {
    timestamps: true
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;