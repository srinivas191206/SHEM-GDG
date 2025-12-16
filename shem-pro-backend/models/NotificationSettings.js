const mongoose = require('mongoose');

const NotificationSettingsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    // Email settings
    emailEnabled: {
        type: Boolean,
        default: true
    },
    emailAddress: {
        type: String,
        default: null
    },
    emailOnHighConfidence: {
        type: Boolean,
        default: true
    },
    emailOnMediumConfidence: {
        type: Boolean,
        default: false
    },
    // SMS settings
    smsEnabled: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: String,
        default: null
    },
    smsOnHighConfidence: {
        type: Boolean,
        default: true
    },
    // Push notification settings
    pushEnabled: {
        type: Boolean,
        default: true
    },
    // Frequency settings
    frequency: {
        type: String,
        enum: ['immediate', 'daily', 'weekly'],
        default: 'immediate'
    },
    // Quiet hours (don't send notifications during these hours)
    quietHoursEnabled: {
        type: Boolean,
        default: true
    },
    quietHoursStart: {
        type: Number,
        default: 23, // 11 PM
        min: 0,
        max: 23
    },
    quietHoursEnd: {
        type: Number,
        default: 7, // 7 AM
        min: 0,
        max: 23
    },
    // Detection sensitivity (affects threshold)
    sensitivity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    // Rate limiting preferences
    maxNotificationsPerDay: {
        type: Number,
        default: 5
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NotificationSettings', NotificationSettingsSchema);
