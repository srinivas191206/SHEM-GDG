const mongoose = require('mongoose');

const UserFeedbackSchema = new mongoose.Schema({
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
    patternType: {
        type: String,
        enum: ['spike', 'dip', 'sustained'],
        required: true
    },
    feedbackType: {
        type: String,
        enum: ['normal', 'problem'],
        required: true
    },
    appliance: {
        type: String,
        default: null
    },
    occurrences: {
        type: Number,
        default: 1,
        min: 1
    },
    lastOccurrence: {
        type: Date,
        default: Date.now
    },
    adjustedThreshold: {
        type: Number,
        default: 2.0,
        min: 1.5,
        max: 3.5
    }
}, {
    timestamps: true
});

// Compound unique index for userId + hour + patternType
UserFeedbackSchema.index({ userId: 1, hour: 1, patternType: 1 }, { unique: true });

module.exports = mongoose.model('UserFeedback', UserFeedbackSchema);
