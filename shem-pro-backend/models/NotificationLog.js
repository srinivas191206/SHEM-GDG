const mongoose = require('mongoose');

const NotificationLogSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    anomalyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnomalyEvent',
        required: true
    },
    type: {
        type: String,
        enum: ['email', 'sms', 'push'],
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'failed', 'rate_limited', 'disabled'],
        default: 'sent'
    },
    recipient: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        default: null
    },
    messagePreview: {
        type: String,
        maxlength: 200
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    // Tracking fields
    linkClicked: {
        type: Boolean,
        default: false
    },
    clickedAt: {
        type: Date,
        default: null
    },
    acknowledged: {
        type: Boolean,
        default: false
    },
    acknowledgedAt: {
        type: Date,
        default: null
    },
    // Error tracking
    errorMessage: {
        type: String,
        default: null
    },
    // Rate limiting tracking
    rateLimitKey: {
        type: String,
        index: true
    }
}, {
    timestamps: true
});

// Compound index for rate limiting queries
NotificationLogSchema.index({ userId: 1, rateLimitKey: 1, sentAt: -1 });
NotificationLogSchema.index({ userId: 1, type: 1, sentAt: -1 });

module.exports = mongoose.model('NotificationLog', NotificationLogSchema);
