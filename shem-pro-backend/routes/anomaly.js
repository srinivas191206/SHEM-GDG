const express = require('express');
const router = express.Router();
const {
    storeConsumption,
    calculateBaselines,
    analyzeAnomaly,
    getAnomalyHistory,
    reportAnomaly,
    getBaselines
} = require('../controllers/anomalyController');

// @route   POST /api/anomaly/consumption
// @desc    Store hourly consumption data for baseline collection
// @access  Public
router.post('/consumption', storeConsumption);

// @route   POST /api/anomaly/calculate-baselines
// @desc    Calculate and update baseline statistics for a user
// @access  Public
router.post('/calculate-baselines', calculateBaselines);

// @route   POST /api/anomaly/analyze
// @desc    Analyze consumption data for anomalies using Z-score method
// @access  Public
router.post('/analyze', analyzeAnomaly);

// @route   GET /api/anomaly/history
// @desc    Get anomaly history for a user
// @access  Public
router.get('/history', getAnomalyHistory);

// @route   POST /api/anomaly/report
// @desc    Report user feedback on detected anomaly (ML improvement)
// @access  Public
router.post('/report', reportAnomaly);

// @route   GET /api/anomaly/baselines
// @desc    Get baseline statistics for a user
// @access  Public
router.get('/baselines', getBaselines);

module.exports = router;
