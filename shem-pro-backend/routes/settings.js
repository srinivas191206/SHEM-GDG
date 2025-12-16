const express = require('express');
const router = express.Router();

// In-memory storage for demo (replace with MongoDB in production)
const userSettings = new Map();

/**
 * POST /api/settings/language
 * Save user's preferred language
 */
router.post('/language', async (req, res) => {
    try {
        const { userId, languageCode } = req.body;

        if (!userId || !languageCode) {
            return res.status(400).json({
                success: false,
                error: 'userId and languageCode are required'
            });
        }

        // Validate language code (10 supported languages)
        const supportedLanguages = ['en', 'hi', 'ta', 'te', 'mr', 'bn', 'gu', 'kn', 'ml', 'pa'];
        if (!supportedLanguages.includes(languageCode)) {
            return res.status(400).json({
                success: false,
                error: `Invalid language code. Supported: ${supportedLanguages.join(', ')}`
            });
        }

        // Store user preference
        userSettings.set(userId, {
            preferredLanguage: languageCode,
            updatedAt: new Date()
        });

        console.log(`[Settings] User ${userId} changed language to ${languageCode}`);

        res.json({
            success: true,
            language: languageCode,
            message: `Language preference saved: ${languageCode}`
        });

    } catch (error) {
        console.error('Error saving language preference:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save language preference'
        });
    }
});

/**
 * GET /api/settings/language/:userId
 * Get user's preferred language
 */
router.get('/language/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const settings = userSettings.get(userId);

        res.json({
            success: true,
            language: settings?.preferredLanguage || 'en',
            updatedAt: settings?.updatedAt || null
        });

    } catch (error) {
        console.error('Error getting language preference:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get language preference'
        });
    }
});

/**
 * GET /api/settings/:userId
 * Get all user settings
 */
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const settings = userSettings.get(userId);

        res.json({
            success: true,
            settings: settings || {
                preferredLanguage: 'en',
                theme: 'dark',
                notifications: true
            }
        });

    } catch (error) {
        console.error('Error getting user settings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get user settings'
        });
    }
});

module.exports = router;
