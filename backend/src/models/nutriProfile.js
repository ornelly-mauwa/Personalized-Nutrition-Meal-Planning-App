const mongoose = require('mongoose');

const nutritionistProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    qualification: {
        type: String,
        required: true
    },
    specialization: {
        type: String
    },
    bio: {
        type: String
    },
    contactInfo: {
        type: String
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    approvedAt: {
        type: Date
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const NutritionistProfile = mongoose.model('NutritionistProfile', nutritionistProfileSchema);

module.exports = NutritionistProfile;