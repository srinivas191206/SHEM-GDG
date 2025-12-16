/**
 * Appliance Predictor Engine
 * Uses pattern matching to identify household appliances from consumption data
 */

const ConsumptionHistory = require('../models/ConsumptionHistory');

// ============================================================================
// KNOWN APPLIANCE SIGNATURES (Indian Households)
// ============================================================================

const APPLIANCE_SIGNATURES = {
    'AC_1_TON': {
        name: 'Air Conditioner (1 ton)',
        icon: '❄️',
        power: 1200,
        variability: 100,
        pattern: 'steady',
        typicalDuration: 'hours',
        confidence: 0.85,
        category: 'cooling',
        peakHours: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        starRating: 3,
        upgradeSavings: 100,
        upgradeMessage: '5-star AC would save ₹100/month',
        maintenanceTip: 'Clean filters monthly for 10% efficiency gain'
    },
    'AC_1_5_TON': {
        name: 'Air Conditioner (1.5 ton)',
        icon: '❄️',
        power: 1800,
        variability: 150,
        pattern: 'steady',
        typicalDuration: 'hours',
        confidence: 0.80,
        category: 'cooling',
        peakHours: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        starRating: 3,
        upgradeSavings: 150,
        upgradeMessage: '5-star AC would save ₹150/month'
    },
    'REFRIGERATOR': {
        name: 'Refrigerator',
        icon: '🧊',
        power: 150,
        variability: 20,
        pattern: 'cycling',
        typicalDuration: '24/7',
        cycleMinutes: 30,
        confidence: 0.90,
        category: 'cooling',
        peakHours: Array.from({ length: 24 }, (_, i) => i), // All hours
        maintenanceTip: 'Defrost monthly to reduce power draw by 15%',
        upgradeMessage: 'Inverter fridge saves 30% energy'
    },
    'WATER_HEATER_2KW': {
        name: 'Water Heater (2 kW)',
        icon: '🚿',
        power: 2000,
        variability: 50,
        pattern: 'constant',
        typicalDuration: '30-60 min',
        confidence: 0.80,
        category: 'heating',
        peakHours: [5, 6, 7, 18, 19, 20],
        upgradeSavings: 83,
        upgradeMessage: 'Solar geyser would save ₹1000/year',
        maintenanceTip: 'Set thermostat to 50°C, not higher'
    },
    'GEYSER_1_5KW': {
        name: 'Geyser (1.5 kW)',
        icon: '🔥',
        power: 1500,
        variability: 50,
        pattern: 'constant',
        typicalDuration: '30-60 min',
        confidence: 0.85,
        category: 'heating',
        peakHours: [5, 6, 7, 18, 19, 20],
        upgradeSavings: 83,
        upgradeMessage: 'Solar geyser would save ₹1000/year'
    },
    'WASHING_MACHINE': {
        name: 'Washing Machine',
        icon: '👕',
        power: 1500,
        variability: 300,
        pattern: 'variable',
        typicalDuration: '45-90 min',
        confidence: 0.75,
        category: 'laundry',
        peakHours: [6, 7, 8, 9, 17, 18, 19],
        maintenanceTip: 'Use cold water wash to save 80% energy'
    },
    'MICROWAVE': {
        name: 'Microwave Oven',
        icon: '📻',
        power: 1000,
        variability: 200,
        pattern: 'burst',
        typicalDuration: '30-60 sec',
        confidence: 0.70,
        category: 'kitchen',
        peakHours: [7, 8, 12, 13, 19, 20, 21]
    },
    'TV': {
        name: 'Television',
        icon: '📺',
        power: 150,
        variability: 50,
        pattern: 'steady',
        typicalDuration: 'hours',
        confidence: 0.65,
        category: 'entertainment',
        peakHours: [18, 19, 20, 21, 22, 23]
    },
    'LIGHTS_ROOM': {
        name: 'Lights (typical room)',
        icon: '💡',
        power: 100,
        variability: 10,
        pattern: 'on_off',
        typicalDuration: 'variable',
        confidence: 0.70,
        category: 'lighting',
        peakHours: [18, 19, 20, 21, 22],
        upgradeMessage: 'LED bulbs save 75% vs CFL'
    },
    'CEILING_FAN': {
        name: 'Ceiling Fan',
        icon: '🌀',
        power: 75,
        variability: 5,
        pattern: 'steady',
        typicalDuration: 'hours',
        confidence: 0.80,
        category: 'cooling',
        peakHours: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    },
    'INDUCTION_COOKTOP': {
        name: 'Induction Cooktop',
        icon: '🍳',
        power: 2000,
        variability: 400,
        pattern: 'variable',
        typicalDuration: '15-60 min',
        confidence: 0.60,
        category: 'kitchen',
        peakHours: [6, 7, 8, 12, 13, 19, 20, 21]
    },
    'STABILIZER': {
        name: 'Voltage Stabilizer',
        icon: '🔌',
        power: 50,
        variability: 10,
        pattern: 'always_on',
        typicalDuration: '24/7',
        confidence: 0.80,
        category: 'other'
    },
    'COMPUTER': {
        name: 'Desktop Computer',
        icon: '🖥️',
        power: 200,
        variability: 50,
        pattern: 'steady',
        typicalDuration: 'hours',
        confidence: 0.65,
        category: 'electronics',
        peakHours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
    },
    'IRON': {
        name: 'Clothes Iron',
        icon: '👔',
        power: 1000,
        variability: 100,
        pattern: 'burst',
        typicalDuration: '15-30 min',
        confidence: 0.70,
        category: 'laundry',
        peakHours: [6, 7, 8, 18, 19]
    },
    'MIXER_GRINDER': {
        name: 'Mixer Grinder',
        icon: '🥤',
        power: 500,
        variability: 150,
        pattern: 'burst',
        typicalDuration: '5-15 min',
        confidence: 0.65,
        category: 'kitchen',
        peakHours: [6, 7, 8, 11, 12, 18, 19]
    }
};

// Electricity rate (₹ per kWh)
const ELECTRICITY_RATE = 8;

// ============================================================================
// PREDICTION FUNCTIONS
// ============================================================================

/**
 * Analyze hourly consumption patterns to detect appliances
 */
const analyzeConsumptionPatterns = async (userId) => {
    // Get last 30 days of data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const consumptionData = await ConsumptionHistory.find({
        userId,
        timestamp: { $gte: thirtyDaysAgo }
    }).sort({ timestamp: 1 });

    if (consumptionData.length < 100) {
        return {
            status: 'insufficient_data',
            dataPoints: consumptionData.length,
            daysNeeded: Math.ceil((100 - consumptionData.length) / 24)
        };
    }

    // Calculate hourly averages
    const hourlyAverages = {};
    const hourlyData = {};

    for (let h = 0; h < 24; h++) {
        hourlyData[h] = [];
    }

    consumptionData.forEach(record => {
        hourlyData[record.hourOfDay].push(record.hourlyConsumption);
    });

    for (let h = 0; h < 24; h++) {
        const values = hourlyData[h];
        if (values.length > 0) {
            hourlyAverages[h] = {
                mean: values.reduce((a, b) => a + b, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values),
                stdDev: calculateStdDev(values)
            };
        }
    }

    // Find baseline (lowest consistent consumption - likely always-on devices)
    const allMeans = Object.values(hourlyAverages).map(h => h.mean);
    const baseline = Math.min(...allMeans);

    // Identify peaks and their characteristics
    const peaks = [];
    for (let h = 0; h < 24; h++) {
        if (hourlyAverages[h]) {
            const aboveBaseline = hourlyAverages[h].mean - baseline;
            if (aboveBaseline > 50) {
                peaks.push({
                    hour: h,
                    power: hourlyAverages[h].mean,
                    aboveBaseline,
                    variability: hourlyAverages[h].stdDev
                });
            }
        }
    }

    return {
        status: 'ready',
        baseline,
        hourlyAverages,
        peaks,
        totalDataPoints: consumptionData.length
    };
};

/**
 * Calculate standard deviation
 */
const calculateStdDev = (values) => {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
};

/**
 * Match consumption patterns to known appliance signatures
 */
const matchAppliances = (analysisResult) => {
    const { baseline, hourlyAverages, peaks } = analysisResult;
    const detectedAppliances = [];
    let remainingPower = 0;

    // Calculate total average daily consumption
    let totalDailyConsumption = 0;
    for (let h = 0; h < 24; h++) {
        if (hourlyAverages[h]) {
            totalDailyConsumption += hourlyAverages[h].mean;
        }
    }

    // 1. Check for always-on devices (refrigerator, stabilizer)
    if (baseline > 100) {
        // Likely refrigerator
        const refSig = APPLIANCE_SIGNATURES.REFRIGERATOR;
        const refConfidence = Math.min(0.95, refSig.confidence * (baseline > 120 ? 1.1 : 0.9));

        detectedAppliances.push({
            ...refSig,
            detectedPower: Math.min(baseline, 200),
            adjustedConfidence: refConfidence,
            usageHours: '24/7 (with cycling)',
            monthlyUnits: Math.round((Math.min(baseline, 200) * 24 * 30) / 1000),
            detectionReason: 'Consistent baseline consumption detected'
        });
    }

    // 2. Check for high-power evening usage (likely AC)
    const eveningPeaks = peaks.filter(p => p.hour >= 18 && p.hour <= 23);
    const avgEveningPower = eveningPeaks.length > 0
        ? eveningPeaks.reduce((sum, p) => sum + p.aboveBaseline, 0) / eveningPeaks.length
        : 0;

    if (avgEveningPower > 800) {
        const acSig = avgEveningPower > 1400
            ? APPLIANCE_SIGNATURES.AC_1_5_TON
            : APPLIANCE_SIGNATURES.AC_1_TON;

        const acConfidence = acSig.confidence * (eveningPeaks.length >= 4 ? 1.1 : 0.9);

        detectedAppliances.push({
            ...acSig,
            detectedPower: Math.round(avgEveningPower),
            adjustedConfidence: Math.min(0.95, acConfidence),
            usageHours: '6 PM - 11 PM',
            monthlyUnits: Math.round((avgEveningPower * 5 * 30) / 1000),
            detectionReason: 'High evening consumption pattern detected'
        });
    }

    // 3. Check for morning/evening spikes (water heater/geyser)
    const morningPeaks = peaks.filter(p => p.hour >= 5 && p.hour <= 8);
    const eveningHeatPeaks = peaks.filter(p => p.hour >= 18 && p.hour <= 20);

    const hasHeaterPattern = morningPeaks.some(p => p.aboveBaseline > 1200) ||
        eveningHeatPeaks.some(p => p.aboveBaseline > 1200);

    if (hasHeaterPattern) {
        const heaterPower = Math.max(
            ...morningPeaks.map(p => p.aboveBaseline),
            ...eveningHeatPeaks.map(p => p.aboveBaseline)
        );

        const heaterSig = heaterPower > 1600
            ? APPLIANCE_SIGNATURES.WATER_HEATER_2KW
            : APPLIANCE_SIGNATURES.GEYSER_1_5KW;

        detectedAppliances.push({
            ...heaterSig,
            detectedPower: Math.round(heaterPower),
            adjustedConfidence: heaterSig.confidence,
            usageHours: 'Morning 6-7 AM, Evening 6-7 PM',
            monthlyUnits: Math.round((heaterPower * 1 * 30) / 1000), // ~1 hour daily
            detectionReason: 'Morning/evening spike pattern detected'
        });
    }

    // 4. Check for afternoon peaks (cooking appliances)
    const afternoonPeaks = peaks.filter(p => (p.hour >= 11 && p.hour <= 14) || (p.hour >= 19 && p.hour <= 21));
    const hasHighCookingPower = afternoonPeaks.some(p => p.aboveBaseline > 1500 && p.variability > 200);

    if (hasHighCookingPower) {
        detectedAppliances.push({
            ...APPLIANCE_SIGNATURES.INDUCTION_COOKTOP,
            detectedPower: 2000,
            adjustedConfidence: 0.60,
            usageHours: 'Lunch & Dinner times',
            monthlyUnits: Math.round((2000 * 1.5 * 30) / 1000),
            detectionReason: 'Variable high-power cooking pattern'
        });
    }

    // 5. Check for entertainment (TV) - moderate evening consumption
    const tvHours = peaks.filter(p => p.hour >= 19 && p.hour <= 23 && p.aboveBaseline >= 100 && p.aboveBaseline < 300);
    if (tvHours.length >= 3) {
        detectedAppliances.push({
            ...APPLIANCE_SIGNATURES.TV,
            detectedPower: 150,
            adjustedConfidence: 0.70,
            usageHours: '7 PM - 11 PM',
            monthlyUnits: Math.round((150 * 4 * 30) / 1000),
            detectionReason: 'Moderate evening consumption pattern'
        });
    }

    // 6. Check for fans (daytime consumption)
    const daytimePeaks = peaks.filter(p => p.hour >= 10 && p.hour <= 17);
    const hasLowSteadyDaytime = daytimePeaks.some(p => p.aboveBaseline >= 50 && p.aboveBaseline < 200);

    if (hasLowSteadyDaytime) {
        detectedAppliances.push({
            ...APPLIANCE_SIGNATURES.CEILING_FAN,
            detectedPower: 75,
            adjustedConfidence: 0.75,
            usageHours: '10 AM - 11 PM',
            monthlyUnits: Math.round((75 * 12 * 30) / 1000),
            detectionReason: 'Low steady daytime consumption'
        });
    }

    // 7. Calculate unidentified consumption
    const totalDetectedPower = detectedAppliances.reduce((sum, a) => sum + a.detectedPower, 0);
    const avgHourlyConsumption = totalDailyConsumption / 24;
    remainingPower = Math.max(0, avgHourlyConsumption - totalDetectedPower - baseline);

    return {
        detectedAppliances,
        unidentifiedPower: Math.round(remainingPower),
        baseline: Math.round(baseline),
        totalDailyConsumption: Math.round(totalDailyConsumption)
    };
};

/**
 * Calculate costs and percentages for each appliance
 */
const calculateCostsAndPercentages = (matchResult) => {
    const { detectedAppliances, unidentifiedPower, baseline, totalDailyConsumption } = matchResult;

    const totalMonthlyUnits = totalDailyConsumption * 30 / 1000;
    const totalMonthlyCost = totalMonthlyUnits * ELECTRICITY_RATE;

    const enrichedAppliances = detectedAppliances.map(appliance => {
        const monthlyUnits = appliance.monthlyUnits || 0;
        const monthlyCost = monthlyUnits * ELECTRICITY_RATE;
        const percentageOfBill = totalMonthlyUnits > 0
            ? Math.round((monthlyUnits / totalMonthlyUnits) * 100)
            : 0;

        return {
            name: appliance.name,
            icon: appliance.icon,
            confidence: `${Math.round(appliance.adjustedConfidence * 100)}%`,
            confidenceValue: appliance.adjustedConfidence,
            estimatedPowerDraw: `${appliance.detectedPower}W`,
            powerValue: appliance.detectedPower,
            estimatedMonthlyUsage: `${monthlyUnits} units`,
            monthlyUnits,
            estimatedCost: `₹${Math.round(monthlyCost)}`,
            costValue: Math.round(monthlyCost),
            percentageOfTotalBill: `${percentageOfBill}%`,
            percentageValue: percentageOfBill,
            typicalUsageHours: appliance.usageHours,
            category: appliance.category,
            upgradeImpact: appliance.upgradeMessage || null,
            maintenanceTip: appliance.maintenanceTip || null,
            upgradeSavings: appliance.upgradeSavings || 0,
            detectionReason: appliance.detectionReason
        };
    });

    // Sort by percentage (highest first)
    enrichedAppliances.sort((a, b) => b.percentageValue - a.percentageValue);

    // Calculate unidentified consumption
    const unidentifiedMonthlyUnits = Math.round((unidentifiedPower * 24 * 30) / 1000);
    const unidentifiedCost = unidentifiedMonthlyUnits * ELECTRICITY_RATE;
    const unidentifiedPercentage = totalMonthlyUnits > 0
        ? Math.round((unidentifiedMonthlyUnits / totalMonthlyUnits) * 100)
        : 0;

    // Generate recommendations
    const recommendations = [];

    enrichedAppliances.forEach(appliance => {
        if (appliance.percentageValue > 30 && appliance.upgradeImpact) {
            recommendations.push(`Your ${appliance.name} uses ${appliance.percentageOfTotalBill} of power. ${appliance.upgradeImpact}`);
        }
        if (appliance.maintenanceTip && appliance.percentageValue > 15) {
            recommendations.push(`${appliance.name}: ${appliance.maintenanceTip}`);
        }
    });

    if (unidentifiedPercentage > 15) {
        recommendations.push('Significant unidentified consumption detected. Check for devices on standby mode.');
    }

    return {
        likelyAppliances: enrichedAppliances,
        unidentifiedConsumption: {
            power: `${unidentifiedPower}W`,
            powerValue: unidentifiedPower,
            monthlyUnits: unidentifiedMonthlyUnits,
            cost: `₹${Math.round(unidentifiedCost)}/month`,
            costValue: Math.round(unidentifiedCost),
            percentage: `${unidentifiedPercentage}%`,
            percentageValue: unidentifiedPercentage,
            reason: 'Could be multiple small appliances, standby losses, or devices not in our database'
        },
        summary: {
            totalMonthlyUnits: Math.round(totalMonthlyUnits),
            totalMonthlyCost: Math.round(totalMonthlyCost),
            baselineConsumption: baseline,
            appliancesDetected: enrichedAppliances.length
        },
        topRecommendations: recommendations.slice(0, 5)
    };
};

/**
 * Main prediction function
 */
const predictAppliances = async (userId) => {
    try {
        // Analyze consumption patterns
        const analysisResult = await analyzeConsumptionPatterns(userId);

        if (analysisResult.status === 'insufficient_data') {
            return {
                status: 'collecting',
                message: 'Still collecting consumption data. Need more history for accurate predictions.',
                dataPoints: analysisResult.dataPoints,
                daysNeeded: analysisResult.daysNeeded
            };
        }

        // Match patterns to appliances
        const matchResult = matchAppliances(analysisResult);

        // Calculate costs and generate recommendations
        const finalResult = calculateCostsAndPercentages(matchResult);

        return {
            status: 'ready',
            ...finalResult
        };
    } catch (error) {
        console.error('Appliance Prediction Error:', error);
        throw error;
    }
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    predictAppliances,
    APPLIANCE_SIGNATURES,
    ELECTRICITY_RATE
};
