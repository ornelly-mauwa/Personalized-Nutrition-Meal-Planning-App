const mongoose = require('mongoose');

const weightTrackingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    recordedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    notes: String
}, {
    timestamps: true
});

const WeightTracking = mongoose.model('WeightTracking', weightTrackingSchema);

module.exports = WeightTracking;