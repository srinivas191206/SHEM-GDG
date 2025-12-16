const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant', 'system'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        // Parsed insights from AI response
        actionItems: [{
            type: String
        }],
        estimatedSavings: {
            type: String,
            default: null
        },
        followUpQuestion: {
            type: String,
            default: null
        }
    }],
    // Context snapshot at conversation start
    contextSnapshot: {
        currentConsumption: Number,
        monthlyConsumption: Number,
        monthlyBudget: Number,
        topAppliances: [String],
        peakHours: String,
        temperature: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
ConversationSchema.index({ userId: 1, createdAt: -1 });
ConversationSchema.index({ userId: 1, sessionId: 1 });

module.exports = mongoose.model('Conversation', ConversationSchema);
