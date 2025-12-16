/**
 * Energy Forecast Engine
 * Uses time-series analysis for consumption prediction
 * Implements simplified ARIMA-like forecasting suitable for Node.js
 */

const ConsumptionHistory = require('../models/ConsumptionHistory');

// ============================================================================
// CONFIGURATION
// ============================================================================

// OpenWeatherMap API (free tier)
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';
const DEFAULT_CITY = process.env.WEATHER_CITY || 'Delhi,IN';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

// Electricity rate (₹ per kWh)
const ELECTRICITY_RATE = 6.5;

// Seasonal multipliers (India)
const SEASONAL_FACTORS = {
    // Summer (Apr-Jun) - High AC usage
    3: 1.25, 4: 1.35, 5: 1.40,
    // Monsoon (Jul-Sep) - Moderate
    6: 1.15, 7: 1.10, 8: 1.10,
    // Post-monsoon (Oct-Nov) - Low
    9: 0.95, 10: 0.90,
    // Winter (Dec-Mar) - Geyser usage
    11: 1.05, 0: 1.10, 1: 1.10, 2: 1.05
};

// Day of week multipliers
const DAY_FACTORS = {
    0: 1.15, // Sunday
    1: 1.00, // Monday
    2: 0.98, // Tuesday
    3: 1.00, // Wednesday
    4: 1.02, // Thursday
    5: 1.08, // Friday
    6: 1.18  // Saturday
};

// Temperature impact on consumption (per degree above 25°C)
const TEMP_FACTOR_ABOVE_25 = 0.03; // 3% increase per degree
const TEMP_FACTOR_BELOW_15 = 0.02; // 2% increase per degree below 15°C

// ============================================================================
// WEATHER API
// ============================================================================

/**
 * Fetch weather forecast from OpenWeatherMap
 */
const fetchWeatherForecast = async (days = 7) => {
    if (!WEATHER_API_KEY) {
        // Return mock data if no API key
        return generateMockWeather(days);
    }

    try {
        const response = await fetch(
            `${WEATHER_API_URL}/forecast?q=${DEFAULT_CITY}&units=metric&cnt=${days * 8}&appid=${WEATHER_API_KEY}`
        );
        const data = await response.json();

        if (data.cod !== '200') {
            console.warn('Weather API error:', data.message);
            return generateMockWeather(days);
        }

        // Group by day and get daily averages
        const dailyWeather = {};
        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!dailyWeather[date]) {
                dailyWeather[date] = {
                    temps: [],
                    humidity: [],
                    conditions: []
                };
            }
            dailyWeather[date].temps.push(item.main.temp);
            dailyWeather[date].humidity.push(item.main.humidity);
            dailyWeather[date].conditions.push(item.weather[0].main);
        });

        return Object.entries(dailyWeather).slice(0, days).map(([date, data]) => ({
            date,
            temperature: Math.round(data.temps.reduce((a, b) => a + b, 0) / data.temps.length),
            humidity: Math.round(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length),
            condition: getMostFrequent(data.conditions)
        }));
    } catch (error) {
        console.error('Weather fetch error:', error);
        return generateMockWeather(days);
    }
};

/**
 * Generate mock weather data for testing
 */
const generateMockWeather = (days) => {
    const weather = [];
    const conditions = ['Clear', 'Clouds', 'Rain', 'Partly Cloudy'];
    const baseTemp = 25 + Math.floor(Math.random() * 10);

    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        weather.push({
            date: date.toISOString().split('T')[0],
            temperature: baseTemp + Math.floor(Math.random() * 5) - 2,
            humidity: 50 + Math.floor(Math.random() * 30),
            condition: conditions[Math.floor(Math.random() * conditions.length)]
        });
    }
    return weather;
};

/**
 * Get most frequent item in array
 */
const getMostFrequent = (arr) => {
    const counts = {};
    arr.forEach(item => counts[item] = (counts[item] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
};

// ============================================================================
// TIME SERIES ANALYSIS
// ============================================================================

/**
 * Simple Moving Average calculation
 */
const calculateSMA = (data, period) => {
    const result = [];
    for (let i = period - 1; i < data.length; i++) {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        result.push(sum / period);
    }
    return result;
};

/**
 * Exponential Moving Average
 */
const calculateEMA = (data, period) => {
    const k = 2 / (period + 1);
    const result = [data[0]];
    for (let i = 1; i < data.length; i++) {
        result.push(data[i] * k + result[i - 1] * (1 - k));
    }
    return result;
};

/**
 * Calculate trend using linear regression
 */
const calculateTrend = (data) => {
    const n = data.length;
    if (n < 2) return { slope: 0, intercept: data[0] || 0 };

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += data[i];
        sumXY += i * data[i];
        sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
};

/**
 * Decompose time series into trend, seasonal, and residual
 */
const decomposeSeries = (dailyData) => {
    // Calculate 7-day moving average for trend
    const trend = calculateSMA(dailyData, 7);

    // Calculate seasonal factors (day of week effect)
    const seasonal = [];
    for (let i = 0; i < 7; i++) {
        const dayValues = dailyData.filter((_, idx) => idx % 7 === i);
        const avg = dayValues.reduce((a, b) => a + b, 0) / dayValues.length;
        seasonal.push(avg);
    }
    const seasonalMean = seasonal.reduce((a, b) => a + b, 0) / 7;
    const normalizedSeasonal = seasonal.map(s => s / seasonalMean);

    return { trend, seasonal: normalizedSeasonal };
};

/**
 * ARIMA-like forecast using decomposition + trend + seasonal
 */
const forecastConsumption = async (userId, daysAhead = 7) => {
    // Get historical data (60 days)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const history = await ConsumptionHistory.find({
        userId,
        timestamp: { $gte: sixtyDaysAgo }
    }).sort({ timestamp: 1 });

    if (history.length < 100) {
        return {
            status: 'insufficient_data',
            dataPoints: history.length,
            daysNeeded: Math.ceil((100 - history.length) / 24)
        };
    }

    // Aggregate to daily totals
    const dailyTotals = {};
    history.forEach(record => {
        const dateStr = record.timestamp.toISOString().split('T')[0];
        dailyTotals[dateStr] = (dailyTotals[dateStr] || 0) + record.hourlyConsumption;
    });

    const dailyData = Object.entries(dailyTotals)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([_, total]) => total / 1000); // Convert Wh to kWh

    if (dailyData.length < 14) {
        return {
            status: 'insufficient_data',
            dataPoints: dailyData.length,
            daysNeeded: 14 - dailyData.length
        };
    }

    // Decompose series
    const { trend, seasonal } = decomposeSeries(dailyData);

    // Calculate trend projection
    const { slope, intercept } = calculateTrend(dailyData.slice(-14));
    const recentAvg = dailyData.slice(-7).reduce((a, b) => a + b, 0) / 7;

    // Get weather forecast
    const weather = await fetchWeatherForecast(daysAhead);

    // Generate forecasts
    const forecasts = [];
    const today = new Date();

    for (let i = 0; i < daysAhead; i++) {
        const forecastDate = new Date(today);
        forecastDate.setDate(forecastDate.getDate() + i + 1);

        const dayOfWeek = forecastDate.getDay();
        const month = forecastDate.getMonth();
        const dateStr = forecastDate.toISOString().split('T')[0];

        // Base prediction from trend
        let prediction = recentAvg + (slope * (i + 1));

        // Apply seasonal factor (day of week)
        const seasonalIdx = dayOfWeek;
        prediction *= seasonal[seasonalIdx] || DAY_FACTORS[dayOfWeek];

        // Apply monthly seasonal factor
        prediction *= SEASONAL_FACTORS[month] || 1.0;

        // Apply weather impact
        const dayWeather = weather[i] || { temperature: 28 };
        if (dayWeather.temperature > 25) {
            prediction *= 1 + (TEMP_FACTOR_ABOVE_25 * (dayWeather.temperature - 25));
        } else if (dayWeather.temperature < 15) {
            prediction *= 1 + (TEMP_FACTOR_BELOW_15 * (15 - dayWeather.temperature));
        }

        // Calculate confidence (decreases with distance)
        const confidence = Math.max(50, 95 - (i * 3));

        // Calculate range based on historical variance
        const variance = calculateVariance(dailyData);
        const stdDev = Math.sqrt(variance);
        const range = {
            min: Math.round(prediction - stdDev * (1 + i * 0.1)),
            max: Math.round(prediction + stdDev * (1 + i * 0.1))
        };

        forecasts.push({
            date: dateStr,
            dayName: forecastDate.toLocaleDateString('en-IN', { weekday: 'long' }),
            dayOfWeek,
            predicted: Math.round(prediction),
            confidence: `${confidence}%`,
            confidenceValue: confidence,
            range,
            cost: Math.round(prediction * ELECTRICITY_RATE),
            weather: dayWeather,
            isWeekend: dayOfWeek === 0 || dayOfWeek === 6
        });
    }

    // Calculate accuracy metrics
    const mape = calculateMAPE(dailyData);

    return {
        status: 'ready',
        forecasts,
        metrics: {
            mape: `${mape.toFixed(1)}%`,
            dataPointsUsed: dailyData.length,
            recentAverage: Math.round(recentAvg),
            trend: slope > 0.5 ? 'increasing' : slope < -0.5 ? 'decreasing' : 'stable'
        }
    };
};

/**
 * Calculate variance of data
 */
const calculateVariance = (data) => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
};

/**
 * Calculate MAPE (Mean Absolute Percentage Error) on last 7 days
 */
const calculateMAPE = (data) => {
    if (data.length < 14) return 15;

    const testData = data.slice(-7);
    const trainData = data.slice(-14, -7);
    const trainAvg = trainData.reduce((a, b) => a + b, 0) / trainData.length;

    let sumAPE = 0;
    testData.forEach(actual => {
        if (actual > 0) {
            sumAPE += Math.abs((actual - trainAvg) / actual) * 100;
        }
    });

    return sumAPE / testData.length;
};

// ============================================================================
// API RESPONSE GENERATORS
// ============================================================================

/**
 * Generate next day forecast response
 */
const getNextDayForecast = async (userId) => {
    const result = await forecastConsumption(userId, 1);

    if (result.status !== 'ready') {
        return result;
    }

    const forecast = result.forecasts[0];
    const weather = forecast.weather;

    // Generate recommendation
    let recommendation = 'Normal usage pattern expected. No action needed.';
    if (forecast.predicted > result.metrics.recentAverage * 1.2) {
        recommendation = 'Higher than usual consumption expected. Consider reducing AC usage.';
    } else if (forecast.isWeekend) {
        recommendation = 'Weekend ahead - typically higher usage. Plan activities accordingly.';
    } else if (weather.temperature > 35) {
        recommendation = 'Hot day expected. AC usage will be high. Consider pre-cooling in morning.';
    }

    return {
        status: 'ready',
        forecastDate: forecast.date,
        dayType: `${forecast.dayName} (${forecast.isWeekend ? 'Weekend' : 'Weekday'})`,
        weather: {
            temperature: weather.temperature,
            condition: weather.condition,
            humidity: weather.humidity
        },
        predictedConsumption: {
            total: forecast.predicted,
            confidence: forecast.confidence,
            range: forecast.range,
            units: 'kWh'
        },
        predictedCost: `₹${forecast.cost}`,
        peakUsageTime: forecast.isWeekend ? '10 AM - 11 PM' : '6 PM - 11 PM',
        recommendation,
        comparisonToAverage: `${forecast.predicted > result.metrics.recentAverage
            ? '+' : ''}${Math.round((forecast.predicted - result.metrics.recentAverage) / result.metrics.recentAverage * 100)}%`
    };
};

/**
 * Generate week forecast response
 */
const getWeekForecast = async (userId) => {
    const result = await forecastConsumption(userId, 7);

    if (result.status !== 'ready') {
        return result;
    }

    const weekTotal = result.forecasts.reduce((sum, f) => sum + f.predicted, 0);
    const weekCost = result.forecasts.reduce((sum, f) => sum + f.cost, 0);

    // Generate alerts
    const alerts = [];
    const highDays = result.forecasts.filter(f => f.predicted > result.metrics.recentAverage * 1.2);
    if (highDays.length > 0) {
        alerts.push(`⚠️ ${highDays.length} day(s) expected above average. Consider reducing usage on ${highDays.map(d => d.dayName).join(', ')}.`);
    }

    const weekendForecasts = result.forecasts.filter(f => f.isWeekend);
    if (weekendForecasts.length > 0) {
        const weekendTotal = weekendForecasts.reduce((sum, f) => sum + f.predicted, 0);
        if (weekendTotal > result.metrics.recentAverage * 2.5) {
            alerts.push('⚠️ Weekend consumption expected to be high. Consider early water heater shut-off.');
        }
    }

    if (alerts.length === 0) {
        alerts.push('✅ Week looks similar to recent patterns. No major concerns.');
    }

    return {
        status: 'ready',
        forecasts: result.forecasts.map(f => ({
            date: f.date,
            dayName: f.dayName,
            predicted: f.predicted,
            confidence: f.confidence,
            cost: `₹${f.cost}`,
            weather: f.weather,
            isWeekend: f.isWeekend,
            isHigh: f.predicted > result.metrics.recentAverage * 1.2,
            isLow: f.predicted < result.metrics.recentAverage * 0.8
        })),
        summary: {
            weekTotal,
            weekCost: `₹${weekCost}`,
            averageDaily: Math.round(weekTotal / 7),
            trend: result.metrics.trend
        },
        alerts,
        metrics: result.metrics
    };
};

/**
 * Generate month forecast response
 */
const getMonthForecast = async (userId) => {
    // Get current month's actual data
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const currentMonthData = await ConsumptionHistory.find({
        userId,
        timestamp: { $gte: startOfMonth }
    });

    const currentMonthTotal = currentMonthData.reduce((sum, r) => sum + r.hourlyConsumption, 0) / 1000;
    const daysElapsed = Math.ceil((new Date() - startOfMonth) / (1000 * 60 * 60 * 24));
    const daysRemaining = 30 - daysElapsed;

    // Get forecast for remaining days
    const result = await forecastConsumption(userId, daysRemaining);

    if (result.status !== 'ready') {
        // Fall back to simple projection
        const projectedRemaining = (currentMonthTotal / daysElapsed) * daysRemaining;
        const projectedTotal = currentMonthTotal + projectedRemaining;

        return {
            status: 'partial',
            currentMonthActual: Math.round(currentMonthTotal),
            projectedRemaining: Math.round(projectedRemaining),
            predictedTotal: Math.round(projectedTotal),
            predictedCost: `₹${Math.round(projectedTotal * ELECTRICITY_RATE)}`,
            message: 'Limited forecast available. More data needed for accurate prediction.'
        };
    }

    const forecastedRemaining = result.forecasts.reduce((sum, f) => sum + f.predicted, 0);
    const predictedTotal = currentMonthTotal + forecastedRemaining;

    // Get last month's data for comparison
    const lastMonthStart = new Date(startOfMonth);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    const lastMonthEnd = new Date(startOfMonth);
    lastMonthEnd.setDate(lastMonthEnd.getDate() - 1);

    const lastMonthData = await ConsumptionHistory.find({
        userId,
        timestamp: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const lastMonthTotal = lastMonthData.reduce((sum, r) => sum + r.hourlyConsumption, 0) / 1000;

    // Calculate comparison
    const monthOverMonthChange = lastMonthTotal > 0
        ? ((predictedTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(0)
        : 0;

    // Subsidy calculation (example: 150 free units)
    const freeUnits = 150;
    const excessUnits = Math.max(0, predictedTotal - freeUnits);
    const excessCost = Math.round(excessUnits * ELECTRICITY_RATE);

    // Generate recommendation
    let recommendation = 'On track for normal monthly consumption.';
    if (predictedTotal > freeUnits + 100) {
        recommendation = `Focus on reducing AC usage in last ${daysRemaining} days to minimize excess charges.`;
    } else if (predictedTotal > lastMonthTotal * 1.15) {
        recommendation = 'Consumption trending higher than last month. Review appliance usage patterns.';
    }

    return {
        status: 'ready',
        currentMonthActual: Math.round(currentMonthTotal),
        forecastedRemaining: Math.round(forecastedRemaining),
        predictedTotal: Math.round(predictedTotal),
        predictedCost: `₹${Math.round(predictedTotal * ELECTRICITY_RATE)}`,
        comparison: {
            vsLastMonth: `${monthOverMonthChange >= 0 ? '+' : ''}${monthOverMonthChange}%`,
            lastMonthTotal: Math.round(lastMonthTotal)
        },
        subsidy: {
            freeUnits,
            projectedTotal: Math.round(predictedTotal),
            excessUnits: Math.round(excessUnits),
            excessCost: `₹${excessCost}`
        },
        daysElapsed,
        daysRemaining,
        recommendation,
        trajectory: predictedTotal > freeUnits
            ? `At current pace, will exceed subsidy by ${Math.round(excessUnits)} units`
            : 'On track to stay within free units limit'
    };
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    getNextDayForecast,
    getWeekForecast,
    getMonthForecast,
    forecastConsumption,
    fetchWeatherForecast
};
