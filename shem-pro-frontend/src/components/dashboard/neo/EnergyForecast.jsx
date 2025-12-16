import React, { useState, useEffect, useCallback } from 'react';
import {
    CalendarDaysIcon,
    ArrowPathIcon,
    SunIcon,
    CloudIcon,
    ChartBarIcon,
    LightBulbIcon,
    AdjustmentsHorizontalIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/solid';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, ReferenceLine
} from 'recharts';

// API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/forecast`
    : 'http://localhost:5000/api/forecast';

// Weather icons
const getWeatherIcon = (condition) => {
    const icons = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Partly Cloudy': '⛅',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️'
    };
    return icons[condition] || '🌤️';
};

// Custom tooltip for chart
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-dashboard-card border border-dashboard-textSecondary/20 rounded-lg p-3 shadow-lg">
                <p className="text-dashboard-text font-bold">{data.dayName}</p>
                <p className="text-accent">{data.predicted} kWh</p>
                <p className="text-dashboard-textSecondary text-sm">{data.confidence} confidence</p>
                {data.weather && (
                    <p className="text-dashboard-textSecondary text-sm">
                        {getWeatherIcon(data.weather.condition)} {data.weather.temperature}°C
                    </p>
                )}
            </div>
        );
    }
    return null;
};

// Next Day Forecast Card
const NextDayCard = ({ forecast, loading }) => {
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl p-6 border border-dashboard-textSecondary/20 animate-pulse">
                <div className="h-32 flex items-center justify-center">
                    <ArrowPathIcon className="w-8 h-8 text-accent animate-spin" />
                </div>
            </div>
        );
    }

    if (!forecast || forecast.status !== 'ready') {
        return (
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl p-6 border border-dashboard-textSecondary/20">
                <div className="text-center py-8">
                    <CalendarDaysIcon className="w-12 h-12 text-accent/50 mx-auto mb-3" />
                    <p className="text-dashboard-textSecondary">Collecting data for accurate forecasts...</p>
                    {forecast?.daysNeeded && (
                        <p className="text-xs text-dashboard-textSecondary mt-2">
                            Need {forecast.daysNeeded} more days of data
                        </p>
                    )}
                </div>
            </div>
        );
    }

    const consumption = forecast.predictedConsumption;
    const weather = forecast.weather;

    return (
        <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl p-6 border border-dashboard-textSecondary/20">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-dashboard-text flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5 text-accent" />
                    Tomorrow's Forecast
                </h3>
                <div className="flex items-center gap-2 text-dashboard-textSecondary text-sm">
                    <span>{getWeatherIcon(weather?.condition)}</span>
                    <span>{weather?.temperature}°C</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Main Prediction */}
                <div className="bg-dashboard-textSecondary/10 rounded-xl p-4 text-center">
                    <p className="text-4xl font-bold text-accent mb-1">{consumption.total}</p>
                    <p className="text-sm text-dashboard-textSecondary">kWh predicted</p>
                    <p className="text-xs text-green-400 mt-2">{consumption.confidence} confident</p>
                </div>

                {/* Cost & Range */}
                <div className="bg-dashboard-textSecondary/10 rounded-xl p-4">
                    <div className="mb-3">
                        <p className="text-xs text-dashboard-textSecondary">Estimated Cost</p>
                        <p className="text-xl font-bold text-dashboard-text">{forecast.predictedCost}</p>
                    </div>
                    <div>
                        <p className="text-xs text-dashboard-textSecondary">Range</p>
                        <p className="text-sm text-dashboard-text">
                            {consumption.range.min} - {consumption.range.max} kWh
                        </p>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-dashboard-textSecondary/10 rounded-lg p-3">
                    <p className="text-xs text-dashboard-textSecondary">Day Type</p>
                    <p className="text-sm text-dashboard-text">{forecast.dayType}</p>
                </div>
                <div className="bg-dashboard-textSecondary/10 rounded-lg p-3">
                    <p className="text-xs text-dashboard-textSecondary">Peak Usage</p>
                    <p className="text-sm text-dashboard-text">{forecast.peakUsageTime}</p>
                </div>
            </div>

            {/* Recommendation */}
            <div className="bg-green-500/10 rounded-xl p-3">
                <p className="text-sm text-green-300 flex items-start gap-2">
                    <LightBulbIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {forecast.recommendation}
                </p>
            </div>
        </div>
    );
};

// Weekly Forecast Chart
const WeeklyForecastChart = ({ forecast, loading }) => {
    if (loading || !forecast?.forecasts) {
        return (
            <div className="bg-dashboard-card rounded-2xl p-6 border border-dashboard-textSecondary/20">
                <div className="h-64 flex items-center justify-center">
                    <ArrowPathIcon className="w-8 h-8 text-accent animate-spin" />
                </div>
            </div>
        );
    }

    const chartData = forecast.forecasts.map(f => ({
        ...f,
        name: f.dayName.slice(0, 3)
    }));

    const average = forecast.metrics?.recentAverage ||
        chartData.reduce((sum, d) => sum + d.predicted, 0) / chartData.length;

    return (
        <div className="bg-dashboard-card rounded-2xl p-6 border border-dashboard-textSecondary/20">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-dashboard-text flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-accent" />
                    7-Day Forecast
                </h3>
                <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-dashboard-textSecondary">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span> Normal
                    </span>
                    <span className="flex items-center gap-1 text-dashboard-textSecondary">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span> High
                    </span>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                        />
                        <YAxis
                            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine
                            y={average}
                            stroke="#f97316"
                            strokeDasharray="5 5"
                            label={{ value: 'Avg', fill: '#f97316', fontSize: 10 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="predicted"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="url(#forecastGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Day Cards */}
            <div className="grid grid-cols-7 gap-2 mt-4">
                {chartData.map((day, idx) => (
                    <div
                        key={idx}
                        className={`rounded-lg p-2 text-center ${day.isHigh ? 'bg-red-500/20' :
                                day.isLow ? 'bg-green-500/20' :
                                    day.isWeekend ? 'bg-purple-500/20' :
                                        'bg-dashboard-textSecondary/10'
                            }`}
                    >
                        <p className="text-xs text-dashboard-textSecondary">{day.name}</p>
                        <p className="text-sm font-bold text-dashboard-text">{day.predicted}</p>
                        <p className="text-xs text-dashboard-textSecondary">
                            {getWeatherIcon(day.weather?.condition)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Alerts */}
            {forecast.alerts && forecast.alerts.length > 0 && (
                <div className="mt-4 space-y-2">
                    {forecast.alerts.map((alert, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-2 rounded-lg p-3 text-sm ${alert.includes('⚠️') ? 'bg-yellow-500/10 text-yellow-300' :
                                    'bg-green-500/10 text-green-300'
                                }`}
                        >
                            {alert}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Monthly Projection Card
const MonthlyProjection = ({ forecast, loading }) => {
    if (loading) {
        return (
            <div className="bg-dashboard-card rounded-2xl p-6 border border-dashboard-textSecondary/20 animate-pulse">
                <div className="h-40 flex items-center justify-center">
                    <ArrowPathIcon className="w-8 h-8 text-accent animate-spin" />
                </div>
            </div>
        );
    }

    if (!forecast || (forecast.status !== 'ready' && forecast.status !== 'partial')) {
        return null;
    }

    const isOverSubsidy = forecast.subsidy?.excessUnits > 0;

    return (
        <div className="bg-dashboard-card rounded-2xl p-6 border border-dashboard-textSecondary/20">
            <h3 className="text-lg font-bold text-dashboard-text mb-4 flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5 text-accent" />
                Monthly Projection
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-dashboard-textSecondary/10 rounded-xl p-4">
                    <p className="text-xs text-dashboard-textSecondary">So Far</p>
                    <p className="text-xl font-bold text-dashboard-text">{forecast.currentMonthActual} kWh</p>
                    <p className="text-xs text-dashboard-textSecondary">{forecast.daysElapsed} days</p>
                </div>
                <div className="bg-dashboard-textSecondary/10 rounded-xl p-4">
                    <p className="text-xs text-dashboard-textSecondary">Forecasted</p>
                    <p className="text-xl font-bold text-dashboard-text">{forecast.forecastedRemaining || '...'} kWh</p>
                    <p className="text-xs text-dashboard-textSecondary">{forecast.daysRemaining} days left</p>
                </div>
                <div className="bg-accent/20 rounded-xl p-4">
                    <p className="text-xs text-dashboard-textSecondary">Projected Total</p>
                    <p className="text-xl font-bold text-accent">{forecast.predictedTotal} kWh</p>
                    <p className="text-xs text-accent">{forecast.predictedCost}</p>
                </div>
                <div className={`rounded-xl p-4 ${isOverSubsidy ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                    <p className="text-xs text-dashboard-textSecondary">vs Last Month</p>
                    <p className={`text-xl font-bold ${forecast.comparison?.vsLastMonth?.startsWith('+') ? 'text-red-400' : 'text-green-400'
                        }`}>
                        {forecast.comparison?.vsLastMonth || 'N/A'}
                    </p>
                </div>
            </div>

            {/* Subsidy Tracking */}
            {forecast.subsidy && (
                <div className={`rounded-xl p-4 mb-4 ${isOverSubsidy ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-dashboard-textSecondary">Subsidy Tracking</span>
                        <span className={`text-sm font-bold ${isOverSubsidy ? 'text-red-400' : 'text-green-400'}`}>
                            {isOverSubsidy ? (
                                <span className="flex items-center gap-1">
                                    <ExclamationTriangleIcon className="w-4 h-4" />
                                    Over by {forecast.subsidy.excessUnits} units
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Within limit
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="w-full bg-dashboard-textSecondary/20 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full transition-all duration-500 ${isOverSubsidy ? 'bg-red-500' : 'bg-green-500'
                                }`}
                            style={{
                                width: `${Math.min(100, (forecast.predictedTotal / forecast.subsidy.freeUnits) * 100)}%`
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-dashboard-textSecondary mt-1">
                        <span>0</span>
                        <span>Free: {forecast.subsidy.freeUnits} units</span>
                        <span>Projected: {forecast.predictedTotal}</span>
                    </div>
                    {isOverSubsidy && (
                        <p className="text-sm text-red-400 mt-2">
                            Extra cost: {forecast.subsidy.excessCost}
                        </p>
                    )}
                </div>
            )}

            {/* Recommendation */}
            {forecast.recommendation && (
                <div className="bg-blue-500/10 rounded-xl p-3">
                    <p className="text-sm text-blue-300 flex items-start gap-2">
                        <LightBulbIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {forecast.recommendation}
                    </p>
                </div>
            )}
        </div>
    );
};

// What-If Calculator
const WhatIfCalculator = ({ userId }) => {
    const [acReduction, setAcReduction] = useState(0);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
        if (acReduction === 0) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/whatif?userId=${userId}&acReduction=${acReduction}`);
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('What-if calculation error:', error);
        }
        setLoading(false);
    };

    return (
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-6 border border-dashboard-textSecondary/20">
            <h3 className="text-lg font-bold text-dashboard-text mb-4 flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-accent" />
                What-If Calculator
            </h3>

            <div className="mb-4">
                <label className="text-sm text-dashboard-textSecondary block mb-2">
                    What if I reduce AC usage by {acReduction}%?
                </label>
                <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={acReduction}
                    onChange={(e) => {
                        setAcReduction(parseInt(e.target.value));
                        setResult(null);
                    }}
                    className="w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-dashboard-textSecondary mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                </div>
            </div>

            <button
                onClick={calculate}
                disabled={acReduction === 0 || loading}
                className="w-full py-3 bg-accent hover:bg-accent/80 disabled:bg-gray-600 rounded-xl transition-colors text-white font-medium flex items-center justify-center gap-2"
            >
                {loading ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                ) : (
                    <>Calculate Savings</>
                )}
            </button>

            {result?.status === 'ready' && (
                <div className="mt-4 p-4 bg-green-500/10 rounded-xl">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-dashboard-textSecondary">Weekly Savings</p>
                            <p className="text-lg font-bold text-green-400">{result.summary.costSaved}</p>
                            <p className="text-xs text-dashboard-textSecondary">
                                {result.summary.unitsSaved} units saved
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-dashboard-textSecondary">Monthly Savings</p>
                            <p className="text-lg font-bold text-green-400">{result.summary.monthlySavings}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main EnergyForecast Component
const EnergyForecast = ({ userId = 'user123' }) => {
    const [nextDayForecast, setNextDayForecast] = useState(null);
    const [weekForecast, setWeekForecast] = useState(null);
    const [monthForecast, setMonthForecast] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchForecasts = useCallback(async () => {
        setLoading(true);
        try {
            const [nextDay, week, month] = await Promise.all([
                fetch(`${API_BASE}/nextDay?userId=${userId}`).then(r => r.json()),
                fetch(`${API_BASE}/week?userId=${userId}`).then(r => r.json()),
                fetch(`${API_BASE}/month?userId=${userId}`).then(r => r.json())
            ]);
            setNextDayForecast(nextDay);
            setWeekForecast(week);
            setMonthForecast(month);
        } catch (error) {
            console.error('Failed to fetch forecasts:', error);
        }
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        fetchForecasts();
    }, [fetchForecasts]);

    return (
        <div className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-dashboard-text flex items-center gap-2">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-accent" />
                    Energy Forecast
                </h2>
                <button
                    onClick={fetchForecasts}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-dashboard-textSecondary/20 hover:bg-dashboard-textSecondary/30 rounded-xl transition-colors text-dashboard-text text-sm"
                >
                    <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Next Day Forecast */}
            <NextDayCard forecast={nextDayForecast} loading={loading} />

            {/* Weekly Forecast Chart */}
            <WeeklyForecastChart forecast={weekForecast} loading={loading} />

            {/* Grid: Monthly + What-If */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MonthlyProjection forecast={monthForecast} loading={loading} />
                <WhatIfCalculator userId={userId} />
            </div>
        </div>
    );
};

export default EnergyForecast;
