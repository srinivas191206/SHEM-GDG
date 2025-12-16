const express = require('express');
const router = express.Router();
const NotificationSettings = require('../models/NotificationSettings');
const NotificationLog = require('../models/NotificationLog');
const {
    trackNotificationClick,
    trackAcknowledgement,
    getNotificationStats
} = require('../services/notificationService');

// @route   GET /api/notifications/settings
// @desc    Get user notification settings
// @access  Public
router.get('/settings', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        let settings = await NotificationSettings.findOne({ userId });

        if (!settings) {
            // Create default settings
            settings = new NotificationSettings({ userId });
            await settings.save();
        }

        res.json(settings);
    } catch (error) {
        console.error('Get notification settings error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/notifications/settings
// @desc    Update user notification settings
// @access  Public
router.post('/settings', async (req, res) => {
    try {
        const { userId, ...settingsData } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        // Validate email if provided
        if (settingsData.emailAddress && !settingsData.emailAddress.includes('@')) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Validate phone if provided
        if (settingsData.phoneNumber && settingsData.phoneNumber.length < 10) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        const settings = await NotificationSettings.findOneAndUpdate(
            { userId },
            { ...settingsData },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            message: 'Notification settings updated',
            settings
        });
    } catch (error) {
        console.error('Update notification settings error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/notifications/track-click
// @desc    Track when user clicks notification link
// @access  Public
router.post('/track-click', async (req, res) => {
    try {
        const { anomalyId, userId } = req.body;

        if (!anomalyId || !userId) {
            return res.status(400).json({ error: 'Missing anomalyId or userId' });
        }

        await trackNotificationClick(anomalyId, userId);

        res.json({ success: true });
    } catch (error) {
        console.error('Track click error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/notifications/track-acknowledge
// @desc    Track when user acknowledges anomaly from notification
// @access  Public
router.post('/track-acknowledge', async (req, res) => {
    try {
        const { anomalyId, userId } = req.body;

        if (!anomalyId || !userId) {
            return res.status(400).json({ error: 'Missing anomalyId or userId' });
        }

        await trackAcknowledgement(anomalyId, userId);

        res.json({ success: true });
    } catch (error) {
        console.error('Track acknowledge error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/notifications/stats
// @desc    Get notification stats for ML improvement
// @access  Public
router.get('/stats', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        const stats = await getNotificationStats(userId);

        res.json(stats);
    } catch (error) {
        console.error('Get notification stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/notifications/history
// @desc    Get notification history for a user
// @access  Public
router.get('/history', async (req, res) => {
    try {
        const { userId, days = 30 } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const logs = await NotificationLog.find({
            userId,
            sentAt: { $gte: startDate }
        })
            .sort({ sentAt: -1 })
            .limit(100)
            .populate('anomalyId', 'consumption deviation timestamp');

        res.json({
            count: logs.length,
            notifications: logs
        });
    } catch (error) {
        console.error('Get notification history error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
