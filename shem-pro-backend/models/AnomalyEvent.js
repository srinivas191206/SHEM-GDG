const mongoose = require('mongoose');

const UserFeedbackSubSchema = new mongoose.Schema({
    appliance: {
        type: String,
        default: null
    },
    duration: {
        type: Number,
        default: null
    },
    wasNormal: {
        type: Boolean,
        default: null
    },
    submittedAt: {
        type: Date,
        default: null
    }
}, { _id: false });

const AnomalyEventSchema = new mongoose.Schema({
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
    hourOfDay: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    consumption: {
        type: Number,
        required: true
    },
    expectedMean: {
        type: Number,
        required: true
    },
    expectedStdDev: {
        type: Number,
        required: true
    },
    zScore: {
        type: Number,
        required: true
    },
    confidence: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    deviation: {
        type: String,
        required: true
    },
    deviationPercent: {
        type: Number,
        required: true
    },
    possibleCause: {
        type: String,
        default: ''
    },
    recommendation: {
        type: String,
        default: ''
    },
    estimatedExtraCost: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['detected', 'acknowledged', 'resolved', 'false_positive'],
        default: 'detected'
    },
    userFeedback: {
        type: UserFeedbackSubSchema,
        default: null
    }
}, {
    timestamps: true
});

// Compound index for efficient querying
AnomalyEventSchema.index({ userId: 1, timestamp: -1 });
AnomalyEventSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('AnomalyEvent', AnomalyEventSchema);
