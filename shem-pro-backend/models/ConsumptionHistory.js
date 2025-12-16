const mongoose = require('mongoose');

const ConsumptionHistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        required: true,
        index: true
    },
    hourlyConsumption: {
        type: Number,
        required: true,
        min: 0
    },
    dayOfWeek: {
        type: Number,
        required: true,
        min: 0,
        max: 6
    },
    hourOfDay: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    temperature: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
});

// Compound index for efficient querying
ConsumptionHistorySchema.index({ userId: 1, timestamp: -1 });
ConsumptionHistorySchema.index({ userId: 1, hourOfDay: 1 });

module.exports = mongoose.model('ConsumptionHistory', ConsumptionHistorySchema);
