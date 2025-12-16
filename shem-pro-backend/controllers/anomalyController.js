const ConsumptionHistory = require('../models/ConsumptionHistory');
const BaselineStatistics = require('../models/BaselineStatistics');
const AnomalyEvent = require('../models/AnomalyEvent');
const UserFeedback = require('../models/UserFeedback');
const { sendAnomalyNotification } = require('../services/notificationService');

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate Z-score for a given value against baseline
 * @param {number} value - Current consumption value
 * @param {number} mean - Baseline mean
 * @param {number} stdDev - Baseline standard deviation
 * @returns {number} Z-score
 */
const calculateZScore = (value, mean, stdDev) => {
    if (stdDev === 0) return 0;
    return (value - mean) / stdDev;
};

/**
 * Determine confidence level based on Z-score
 * @param {number} zScore - Calculated Z-score
 * @returns {object} { isAnomaly, confidence }
 */
const determineConfidence = (zScore, thresholdMultiplier = 2.0) => {
    const absZScore = Math.abs(zScore);

    if (absZScore > 3.0) {
        return { isAnomaly: true, confidence: 'high' };
    } else if (absZScore > 2.5) {
        return { isAnomaly: true, confidence: 'medium' };
    } else if (absZScore > thresholdMultiplier) {
        return { isAnomaly: true, confidence: 'low' };
    }
    return { isAnomaly: false, confidence: null };
};

/**
 * Identify possible cause based on consumption patterns
 * @param {number} consumption - Current consumption in Watts
 * @param {number} mean - Expected mean consumption
 * @param {number} hour - Hour of day (0-23)
 * @param {number} zScore - Calculated Z-score
 * @returns {string} Possible cause description
 */
const identifyPossibleCause = (consumption, mean, hour, zScore) => {
    const isSpike = zScore > 0;
    const deviation = Math.abs(consumption - mean);

    if (isSpike) {
        // High consumption anomaly
        if (deviation > 1000) {
            if (hour >= 10 && hour <= 16) {
                return 'AC running at high capacity, possible water heater';
            } else if (hour >= 17 && hour <= 23) {
                return 'AC running, Heater possibly on, multiple appliances';
            } else {
                return 'Water heater, possible appliance left running overnight';
            }
        } else if (deviation > 500) {
            if (hour >= 6 && hour <= 9) {
                return 'Morning appliances: geyser, microwave, iron';
            } else if (hour >= 18 && hour <= 22) {
                return 'Evening appliances: AC, TV, cooking appliances';
            } else {
                return 'Unexpected appliance usage';
            }
        } else {
            return 'Multiple smaller appliances running simultaneously';
        }
    } else {
        // Low consumption anomaly (unusual dip)
        if (deviation > 500) {
            return 'Significant drop in usage - possible power outage or away from home';
        } else {
            return 'Lower than usual consumption - appliances turned off or on vacation';
        }
    }
};

/**
 * Generate recommendation based on anomaly type
 * @param {number} consumption - Current consumption
 * @param {number} mean - Expected mean
 * @param {number} hour - Hour of day
 * @param {number} zScore - Calculated Z-score
 * @returns {string} Recommendation
 */
const generateRecommendation = (consumption, mean, hour, zScore) => {
    const isSpike = zScore > 0;
    const deviation = Math.abs(consumption - mean);

    if (isSpike) {
        if (deviation > 1000) {
            return 'Check AC thermostat settings, verify no appliances left on accidentally. Consider scheduling high-power usage during off-peak hours.';
        } else if (deviation > 500) {
            if (hour >= 17 && hour <= 22) {
                return 'Review evening appliance usage, consider shifting some loads to off-peak hours (after 11 PM).';
            } else {
                return 'Check for appliances that may be running unnecessarily. Verify timer settings.';
            }
        } else {
            return 'Monitor usage patterns. If this recurs frequently, check for appliance efficiency issues.';
        }
    } else {
        return 'Unusually low consumption detected. Verify all essential appliances are functioning correctly.';
    }
};

/**
 * Estimate extra cost based on deviation
 * @param {number} deviation - Consumption deviation in Watts
 * @param {number} rate - Current electricity rate (₹/kWh)
 * @returns {number} Estimated extra cost in ₹
 */
const estimateExtraCost = (deviation, rate = 6.5) => {
    // Assuming deviation is sustained for 1 hour
    const extraKWh = Math.abs(deviation) / 1000;
    return Math.round(extraKWh * rate);
};

/**
 * Calculate standard deviation from array of values
 * @param {number[]} values - Array of consumption values
 * @param {number} mean - Pre-calculated mean
 * @returns {number} Standard deviation
 */
const calculateStdDev = (values, mean) => {
    if (values.length === 0) return 0;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
};

// ============================================================================
// CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Store hourly consumption data
 * POST /api/anomaly/consumption
 */
exports.storeConsumption = async (req, res) => {
    try {
        const { userId, hourlyConsumption, timestamp, temperature } = req.body;

        // Validate inputs
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing userId' });
        }
        if (typeof hourlyConsumption !== 'number' || hourlyConsumption < 0) {
            return res.status(400).json({ error: 'Invalid hourlyConsumption value' });
        }

        const date = timestamp ? new Date(timestamp) : new Date();
        const dayOfWeek = date.getDay();
        const hourOfDay = date.getHours();

        // Store consumption data
        const consumption = new ConsumptionHistory({
            userId,
            timestamp: date,
            hourlyConsumption,
            dayOfWeek,
            hourOfDay,
            temperature: temperature || null
        });

        await consumption.save();

        // Check if we have enough data to calculate baselines (30+ days)
        const oldestRecord = await ConsumptionHistory.findOne({ userId })
            .sort({ timestamp: 1 })
            .select('timestamp');

        let baselineStatus = 'collecting';
        let daysOfData = 0;

        if (oldestRecord) {
            const daysDiff = Math.floor((date - oldestRecord.timestamp) / (1000 * 60 * 60 * 24));
            daysOfData = daysDiff + 1;

            if (daysOfData >= 30) {
                baselineStatus = 'ready';
            }
        }

        res.json({
            success: true,
            message: 'Consumption data stored',
            baselineStatus,
            daysOfData,
            daysRemaining: Math.max(0, 30 - daysOfData)
        });
    } catch (error) {
        console.error('Store Consumption Error:', error);
        res.status(500).json({ error: 'Server error storing consumption data' });
    }
};

/**
 * Calculate and update baseline statistics for a user
 * POST /api/anomaly/calculate-baselines
 */
exports.calculateBaselines = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing userId' });
        }

        // Check if we have at least 30 days of data
        const oldestRecord = await ConsumptionHistory.findOne({ userId })
            .sort({ timestamp: 1 })
            .select('timestamp');

        if (!oldestRecord) {
            return res.status(400).json({
                error: 'No consumption data found for user',
                daysOfData: 0,
                daysRemaining: 30
            });
        }

        const daysDiff = Math.floor((new Date() - oldestRecord.timestamp) / (1000 * 60 * 60 * 24));

        if (daysDiff < 30) {
            return res.status(400).json({
                error: 'Insufficient data for baseline calculation. Need at least 30 days.',
                daysOfData: daysDiff + 1,
                daysRemaining: 30 - daysDiff - 1
            });
        }

        // Calculate baselines for each hour (0-23)
        const baselines = [];

        for (let hour = 0; hour <= 23; hour++) {
            const consumptionData = await ConsumptionHistory.find({
                userId,
                hourOfDay: hour
            }).select('hourlyConsumption');

            const values = consumptionData.map(c => c.hourlyConsumption);

            if (values.length > 0) {
                const mean = values.reduce((a, b) => a + b, 0) / values.length;
                const stdDev = calculateStdDev(values, mean);
                const min = Math.min(...values);
                const max = Math.max(...values);

                // Get existing threshold multiplier if it exists (from ML feedback)
                const existingBaseline = await BaselineStatistics.findOne({ userId, hour });
                const thresholdMultiplier = existingBaseline?.thresholdMultiplier || 2.0;

                const baseline = await BaselineStatistics.findOneAndUpdate(
                    { userId, hour },
                    {
                        userId,
                        hour,
                        mean: Math.round(mean * 100) / 100,
                        stdDev: Math.round(stdDev * 100) / 100,
                        min,
                        max,
                        dataPoints: values.length,
                        thresholdMultiplier,
                        lastUpdated: new Date()
                    },
                    { upsert: true, new: true }
                );

                baselines.push(baseline);
            }
        }

        res.json({
            success: true,
            message: 'Baseline statistics calculated',
            baselinesCount: baselines.length,
            baselines: baselines.map(b => ({
                hour: b.hour,
                mean: b.mean,
                stdDev: b.stdDev,
                min: b.min,
                max: b.max,
                dataPoints: b.dataPoints
            }))
        });
    } catch (error) {
        console.error('Calculate Baselines Error:', error);
        res.status(500).json({ error: 'Server error calculating baselines' });
    }
};

/**
 * Analyze consumption for anomalies
 * POST /api/anomaly/analyze
 */
exports.analyzeAnomaly = async (req, res) => {
    try {
        const { userId, consumptionValue, timestamp } = req.body;

        // Validate inputs
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing userId' });
        }
        if (typeof consumptionValue !== 'number' || consumptionValue < 0) {
            return res.status(400).json({ error: 'Invalid consumptionValue' });
        }

        const date = timestamp ? new Date(timestamp) : new Date();
        const hourOfDay = date.getHours();

        // Get baseline for current hour
        const baseline = await BaselineStatistics.findOne({ userId, hour: hourOfDay });

        if (!baseline) {
            // Check how much data we have
            const dataCount = await ConsumptionHistory.countDocuments({ userId });

            return res.json({
                isAnomaly: false,
                status: 'insufficient_data',
                message: 'Baseline not yet established. Continue collecting data.',
                currentValue: consumptionValue,
                dataPointsCollected: dataCount,
                baselineStatus: 'collecting'
            });
        }

        // Calculate Z-score
        const zScore = calculateZScore(consumptionValue, baseline.mean, baseline.stdDev);
        const { isAnomaly, confidence } = determineConfidence(zScore, baseline.thresholdMultiplier);

        // Calculate expected range (mean ± threshold * stdDev)
        const expectedMin = Math.round(baseline.mean - (baseline.thresholdMultiplier * baseline.stdDev));
        const expectedMax = Math.round(baseline.mean + (baseline.thresholdMultiplier * baseline.stdDev));

        // Calculate deviation
        const deviation = consumptionValue - baseline.mean;
        const deviationPercent = baseline.mean !== 0
            ? ((deviation / baseline.mean) * 100).toFixed(1)
            : 0;
        const deviationStr = `${deviation >= 0 ? '+' : ''}${Math.round(deviation)}W (${deviation >= 0 ? '+' : ''}${deviationPercent}%)`;

        if (!isAnomaly) {
            return res.json({
                isAnomaly: false,
                zScore: Math.round(zScore * 100) / 100,
                currentValue: consumptionValue,
                expectedRange: { min: Math.max(0, expectedMin), max: expectedMax },
                status: 'normal',
                baselineStatus: 'active',
                hour: hourOfDay
            });
        }

        // Anomaly detected - gather additional info
        const possibleCause = identifyPossibleCause(consumptionValue, baseline.mean, hourOfDay, zScore);
        const recommendation = generateRecommendation(consumptionValue, baseline.mean, hourOfDay, zScore);
        const estimatedExtraCost = estimateExtraCost(deviation);

        // Store anomaly event
        const anomalyEvent = new AnomalyEvent({
            userId,
            timestamp: date,
            hourOfDay,
            consumption: consumptionValue,
            expectedMean: baseline.mean,
            expectedStdDev: baseline.stdDev,
            zScore: Math.round(zScore * 100) / 100,
            confidence,
            deviation: deviationStr,
            deviationPercent: parseFloat(deviationPercent),
            possibleCause,
            recommendation,
            estimatedExtraCost,
            status: 'detected'
        });

        await anomalyEvent.save();

        // Trigger notification for high-confidence anomalies
        if (confidence === 'high') {
            // Send notification asynchronously (don't block response)
            sendAnomalyNotification(anomalyEvent).catch(err => {
                console.error('Notification send error:', err);
            });
        }

        res.json({
            isAnomaly: true,
            anomalyId: anomalyEvent._id,
            confidence,
            zScore: Math.round(zScore * 100) / 100,
            expectedRange: { min: Math.max(0, expectedMin), max: expectedMax },
            currentValue: consumptionValue,
            deviation: deviationStr,
            possibleCause,
            recommendation,
            estimatedExtraCost,
            baselineStatus: 'active',
            dataPointsUsed: baseline.dataPoints,
            hour: hourOfDay
        });
    } catch (error) {
        console.error('Analyze Anomaly Error:', error);
        res.status(500).json({ error: 'Server error analyzing consumption' });
    }
};

/**
 * Get anomaly history for a user
 * GET /api/anomaly/history
 */
exports.getAnomalyHistory = async (req, res) => {
    try {
        const { userId, days = 7 } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing userId' });
        }

        const daysNum = parseInt(days, 10);
        if (isNaN(daysNum) || daysNum < 1 || daysNum > 365) {
            return res.status(400).json({ error: 'Invalid days parameter (must be 1-365)' });
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysNum);

        const anomalies = await AnomalyEvent.find({
            userId,
            timestamp: { $gte: startDate }
        })
            .sort({ timestamp: -1 })
            .select('timestamp consumption deviation deviationPercent confidence possibleCause status hourOfDay zScore');

        // Calculate summary statistics
        let avgDeviationPercent = 0;
        const hourCounts = {};
        const causeCounts = {};

        anomalies.forEach(a => {
            avgDeviationPercent += Math.abs(a.deviationPercent);
            hourCounts[a.hourOfDay] = (hourCounts[a.hourOfDay] || 0) + 1;
            if (a.possibleCause) {
                causeCounts[a.possibleCause] = (causeCounts[a.possibleCause] || 0) + 1;
            }
        });

        avgDeviationPercent = anomalies.length > 0
            ? Math.round(avgDeviationPercent / anomalies.length * 10) / 10
            : 0;

        // Find most common hour
        let mostCommonHour = null;
        let maxHourCount = 0;
        for (const [hour, count] of Object.entries(hourCounts)) {
            if (count > maxHourCount) {
                maxHourCount = count;
                mostCommonHour = parseInt(hour, 10);
            }
        }

        // Find most common cause
        let mostCommonCause = null;
        let maxCauseCount = 0;
        for (const [cause, count] of Object.entries(causeCounts)) {
            if (count > maxCauseCount) {
                maxCauseCount = count;
                mostCommonCause = cause;
            }
        }

        res.json({
            totalAnomalies: anomalies.length,
            anomalies: anomalies.map(a => ({
                id: a._id,
                timestamp: a.timestamp.toISOString(),
                consumption: a.consumption,
                deviation: a.deviation,
                confidence: a.confidence,
                possibleCause: a.possibleCause,
                status: a.status
            })),
            summary: {
                avgDeviationPercent,
                mostCommonHour,
                mostCommonCause
            }
        });
    } catch (error) {
        console.error('Get Anomaly History Error:', error);
        res.status(500).json({ error: 'Server error fetching anomaly history' });
    }
};

/**
 * Report user feedback on anomaly
 * POST /api/anomaly/report
 */
exports.reportAnomaly = async (req, res) => {
    try {
        const { userId, anomalyId, appliance, duration, wasNormal } = req.body;

        // Validate inputs
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing userId' });
        }
        if (!anomalyId || typeof anomalyId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing anomalyId' });
        }
        if (typeof wasNormal !== 'boolean') {
            return res.status(400).json({ error: 'wasNormal must be a boolean' });
        }

        // Find and update the anomaly event
        const anomalyEvent = await AnomalyEvent.findById(anomalyId);

        if (!anomalyEvent) {
            return res.status(404).json({ error: 'Anomaly event not found' });
        }

        if (anomalyEvent.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized to update this anomaly' });
        }

        // Update anomaly with feedback
        anomalyEvent.userFeedback = {
            appliance: appliance || null,
            duration: duration || null,
            wasNormal,
            submittedAt: new Date()
        };
        anomalyEvent.status = wasNormal ? 'false_positive' : 'acknowledged';
        await anomalyEvent.save();

        // Determine pattern type based on Z-score
        const patternType = anomalyEvent.zScore > 0 ? 'spike' : 'dip';

        // Update or create user feedback tracking for ML improvement
        const existingFeedback = await UserFeedback.findOne({
            userId,
            hour: anomalyEvent.hourOfDay,
            patternType
        });

        let newThreshold = 2.0;

        if (existingFeedback) {
            if (wasNormal) {
                // User says this was normal - increase threshold
                existingFeedback.occurrences += 1;
                existingFeedback.feedbackType = 'normal';
                existingFeedback.appliance = appliance || existingFeedback.appliance;
                existingFeedback.lastOccurrence = new Date();

                // Increase threshold by 0.1 for each normal feedback, max 3.5
                existingFeedback.adjustedThreshold = Math.min(
                    3.5,
                    existingFeedback.adjustedThreshold + 0.1
                );
                newThreshold = existingFeedback.adjustedThreshold;
            } else {
                // User says this was a problem - decrease threshold
                existingFeedback.feedbackType = 'problem';
                existingFeedback.lastOccurrence = new Date();

                // Decrease threshold by 0.1, min 1.5
                existingFeedback.adjustedThreshold = Math.max(
                    1.5,
                    existingFeedback.adjustedThreshold - 0.1
                );
                newThreshold = existingFeedback.adjustedThreshold;
            }
            await existingFeedback.save();
        } else {
            // Create new feedback record
            const feedbackRecord = new UserFeedback({
                userId,
                hour: anomalyEvent.hourOfDay,
                patternType,
                feedbackType: wasNormal ? 'normal' : 'problem',
                appliance: appliance || null,
                occurrences: 1,
                adjustedThreshold: wasNormal ? 2.1 : 1.9
            });
            await feedbackRecord.save();
            newThreshold = feedbackRecord.adjustedThreshold;
        }

        // Update baseline threshold for this hour if feedback count >= 3
        if (existingFeedback && existingFeedback.occurrences >= 3 && wasNormal) {
            await BaselineStatistics.findOneAndUpdate(
                { userId, hour: anomalyEvent.hourOfDay },
                { thresholdMultiplier: newThreshold }
            );
        }

        res.json({
            success: true,
            message: wasNormal
                ? 'Feedback recorded. Detection threshold adjusted to reduce false positives.'
                : 'Feedback recorded. This pattern will be monitored more closely.',
            newThreshold: Math.round(newThreshold * 10) / 10,
            feedbackCount: existingFeedback ? existingFeedback.occurrences : 1
        });
    } catch (error) {
        console.error('Report Anomaly Error:', error);
        res.status(500).json({ error: 'Server error processing feedback' });
    }
};

/**
 * Get baseline statistics for a user
 * GET /api/anomaly/baselines
 */
exports.getBaselines = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing userId' });
        }

        const baselines = await BaselineStatistics.find({ userId })
            .sort({ hour: 1 })
            .select('hour mean stdDev min max dataPoints thresholdMultiplier lastUpdated');

        if (baselines.length === 0) {
            // Check data collection status
            const dataCount = await ConsumptionHistory.countDocuments({ userId });
            const oldestRecord = await ConsumptionHistory.findOne({ userId })
                .sort({ timestamp: 1 })
                .select('timestamp');

            let daysOfData = 0;
            if (oldestRecord) {
                daysOfData = Math.floor((new Date() - oldestRecord.timestamp) / (1000 * 60 * 60 * 24)) + 1;
            }

            return res.json({
                status: 'collecting',
                baselines: [],
                dataPointsCollected: dataCount,
                daysOfData,
                daysRemaining: Math.max(0, 30 - daysOfData)
            });
        }

        res.json({
            status: 'active',
            baselines: baselines.map(b => ({
                hour: b.hour,
                mean: b.mean,
                stdDev: b.stdDev,
                min: b.min,
                max: b.max,
                dataPoints: b.dataPoints,
                thresholdMultiplier: b.thresholdMultiplier,
                lastUpdated: b.lastUpdated
            }))
        });
    } catch (error) {
        console.error('Get Baselines Error:', error);
        res.status(500).json({ error: 'Server error fetching baselines' });
    }
};
