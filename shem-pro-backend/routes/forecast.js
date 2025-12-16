const express = require('express');
const router = express.Router();
const {
    getNextDayForecast,
    getWeekForecast,
    getMonthForecast
} = require('../services/energyForecastService');

// @route   GET /api/forecast/nextDay
// @desc    Get next day consumption forecast
// @access  Public
router.get('/nextDay', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid userId' });
        }

        const forecast = await getNextDayForecast(userId);
        res.json(forecast);
    } catch (error) {
        console.error('Next Day Forecast Error:', error);
        res.status(500).json({ error: 'Server error generating forecast' });
    }
});

// @route   GET /api/forecast/week
// @desc    Get 7-day consumption forecast
// @access  Public
router.get('/week', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid userId' });
        }

        const forecast = await getWeekForecast(userId);
        res.json(forecast);
    } catch (error) {
        console.error('Week Forecast Error:', error);
        res.status(500).json({ error: 'Server error generating forecast' });
    }
});

// @route   GET /api/forecast/month
// @desc    Get monthly consumption forecast and projection
// @access  Public
router.get('/month', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid userId' });
        }

        const forecast = await getMonthForecast(userId);
        res.json(forecast);
    } catch (error) {
        console.error('Month Forecast Error:', error);
        res.status(500).json({ error: 'Server error generating forecast' });
    }
});

// @route   GET /api/forecast/whatif
// @desc    What-if scenario calculator
// @access  Public
router.get('/whatif', async (req, res) => {
    try {
        const { userId, acReduction = 0 } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid userId' });
        }

        // Get base forecast
        const baseForecast = await getWeekForecast(userId);

        if (baseForecast.status !== 'ready') {
            return res.json(baseForecast);
        }

        // Apply AC reduction (AC typically 40-50% of consumption)
        const reductionPercent = parseFloat(acReduction) / 100;
        const acContribution = 0.45; // Assume AC is 45% of consumption

        const adjustedForecasts = baseForecast.forecasts.map(f => {
            const reduction = f.predicted * acContribution * reductionPercent;
            const newPredicted = Math.round(f.predicted - reduction);
            return {
                ...f,
                originalPredicted: f.predicted,
                predicted: newPredicted,
                savings: Math.round(reduction * 6.5), // Cost savings
                cost: `₹${Math.round(newPredicted * 6.5)}`
            };
        });

        const originalTotal = baseForecast.summary.weekTotal;
        const newTotal = adjustedForecasts.reduce((sum, f) => sum + f.predicted, 0);
        const totalSavings = Math.round((originalTotal - newTotal) * 6.5);

        res.json({
            status: 'ready',
            scenario: `${acReduction}% AC reduction`,
            forecasts: adjustedForecasts,
            summary: {
                originalWeekTotal: originalTotal,
                adjustedWeekTotal: newTotal,
                unitsSaved: originalTotal - newTotal,
                costSaved: `₹${totalSavings}`,
                monthlySavings: `₹${totalSavings * 4}` // Approximate monthly
            }
        });
    } catch (error) {
        console.error('What-If Forecast Error:', error);
        res.status(500).json({ error: 'Server error calculating scenario' });
    }
});

module.exports = router;
