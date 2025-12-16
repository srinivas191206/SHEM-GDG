const express = require('express');
const router = express.Router();
const { predictAppliances, APPLIANCE_SIGNATURES } = require('../services/appliancePredictorService');

// @route   GET /api/appliance/predict
// @desc    Get appliance breakdown prediction for a user
// @access  Public
router.get('/predict', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid userId' });
        }

        const prediction = await predictAppliances(userId);

        res.json(prediction);
    } catch (error) {
        console.error('Appliance Prediction Error:', error);
        res.status(500).json({ error: 'Server error during appliance prediction' });
    }
});

// @route   GET /api/appliance/signatures
// @desc    Get list of known appliance signatures
// @access  Public
router.get('/signatures', (req, res) => {
    const signatures = Object.entries(APPLIANCE_SIGNATURES).map(([key, sig]) => ({
        id: key,
        name: sig.name,
        icon: sig.icon,
        typicalPower: sig.power,
        category: sig.category,
        confidence: sig.confidence
    }));

    res.json({
        count: signatures.length,
        signatures
    });
});

// @route   POST /api/appliance/feedback
// @desc    Submit feedback on appliance detection accuracy
// @access  Public
router.post('/feedback', async (req, res) => {
    try {
        const { userId, applianceName, isCorrect, actualAppliance } = req.body;

        if (!userId || !applianceName) {
            return res.status(400).json({ error: 'Missing userId or applianceName' });
        }

        // TODO: Store feedback for ML improvement
        // For now, just acknowledge receipt
        console.log('Appliance feedback received:', { userId, applianceName, isCorrect, actualAppliance });

        res.json({
            success: true,
            message: 'Thank you for your feedback! This helps improve our detection accuracy.'
        });
    } catch (error) {
        console.error('Appliance Feedback Error:', error);
        res.status(500).json({ error: 'Server error processing feedback' });
    }
});

// @route   POST /api/appliance/add-manual
// @desc    Manually add an appliance the user owns
// @access  Public
router.post('/add-manual', async (req, res) => {
    try {
        const { userId, applianceId, customName, estimatedPower } = req.body;

        if (!userId || !applianceId) {
            return res.status(400).json({ error: 'Missing userId or applianceId' });
        }

        // Validate appliance exists in signatures
        if (!APPLIANCE_SIGNATURES[applianceId]) {
            return res.status(400).json({
                error: 'Unknown appliance type',
                validTypes: Object.keys(APPLIANCE_SIGNATURES)
            });
        }

        // TODO: Store manual appliance addition for improved prediction
        console.log('Manual appliance added:', { userId, applianceId, customName, estimatedPower });

        res.json({
            success: true,
            message: 'Appliance added successfully. This will improve future predictions.',
            appliance: {
                id: applianceId,
                name: customName || APPLIANCE_SIGNATURES[applianceId].name,
                power: estimatedPower || APPLIANCE_SIGNATURES[applianceId].power
            }
        });
    } catch (error) {
        console.error('Add Manual Appliance Error:', error);
        res.status(500).json({ error: 'Server error adding appliance' });
    }
});

module.exports = router;
