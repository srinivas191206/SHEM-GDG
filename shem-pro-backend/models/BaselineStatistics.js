const mongoose = require('mongoose');

const BaselineStatisticsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    hour: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    mean: {
        type: Number,
        required: true,
        default: 0
    },
    stdDev: {
        type: Number,
        required: true,
        default: 0
    },
    min: {
        type: Number,
        required: true,
        default: 0
    },
    max: {
        type: Number,
        required: true,
        default: 0
    },
    dataPoints: {
        type: Number,
        required: true,
        default: 0
    },
    thresholdMultiplier: {
        type: Number,
        default: 2.0,
        min: 1.5,
        max: 3.5
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound unique index for userId + hour
BaselineStatisticsSchema.index({ userId: 1, hour: 1 }, { unique: true });

module.exports = mongoose.model('BaselineStatistics', BaselineStatisticsSchema);
