const mongoose = require('mongoose');

const RateLimitSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    endpoint: {
        type: String,
        required: true
    },
    requests: [{
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    hourStart: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// TTL index - automatically delete after 2 hours
RateLimitSchema.index({ hourStart: 1 }, { expireAfterSeconds: 7200 });
RateLimitSchema.index({ userId: 1, endpoint: 1, hourStart: 1 });

module.exports = mongoose.model('RateLimit', RateLimitSchema);
