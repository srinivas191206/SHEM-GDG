import React, { useState, useEffect, useCallback } from 'react';
import {
    ChartPieIcon,
    ArrowPathIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    LightBulbIcon,
    CheckCircleIcon,
    XCircleIcon,
    CogIcon,
    SparklesIcon,
    PlusIcon
} from '@heroicons/react/24/solid';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

// API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/appliance`
    : 'http://localhost:5000/api/appliance';

// Color palette for pie chart
const COLORS = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1'
];

// Confidence color helper
const getConfidenceColor = (confidenceValue) => {
    if (confidenceValue >= 0.85) return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'High' };
    if (confidenceValue >= 0.70) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Medium' };
    return { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'Low' };
};

// Custom tooltip for pie chart
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-dashboard-card border border-dashboard-textSecondary/20 rounded-lg p-3 shadow-lg">
                <p className="text-dashboard-text font-bold">{data.name}</p>
                <p className="text-dashboard-textSecondary text-sm">{data.percentage}% of total bill</p>
                <p className="text-accent text-sm">₹{data.cost}/month</p>
            </div>
        );
    }
    return null;
};

// Appliance Detail Card
const ApplianceCard = ({ appliance, index, isExpanded, onToggle, onFeedback }) => {
    const confidenceInfo = getConfidenceColor(appliance.confidenceValue);

    return (
        <div className="bg-dashboard-textSecondary/5 rounded-xl border border-dashboard-textSecondary/10 overflow-hidden">
            {/* Card Header */}
            <div
                className="p-4 cursor-pointer hover:bg-dashboard-textSecondary/10 transition-colors"
                onClick={onToggle}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                            style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                        >
                            {appliance.icon}
                        </div>
                        <div>
                            <h4 className="text-dashboard-text font-medium">{appliance.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${confidenceInfo.bg} ${confidenceInfo.text}`}>
                                    {appliance.confidence} confident
                                </span>
                                <span className="text-dashboard-textSecondary text-xs">
                                    {appliance.estimatedPowerDraw}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-dashboard-text font-bold">{appliance.percentageOfTotalBill}</p>
                            <p className="text-dashboard-textSecondary text-xs">{appliance.estimatedCost}/mo</p>
                        </div>
                        {isExpanded ? (
                            <ChevronUpIcon className="w-5 h-5 text-dashboard-textSecondary" />
                        ) : (
                            <ChevronDownIcon className="w-5 h-5 text-dashboard-textSecondary" />
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-dashboard-textSecondary/10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-dashboard-textSecondary/10 rounded-lg p-3">
                            <p className="text-xs text-dashboard-textSecondary">Monthly Usage</p>
                            <p className="text-dashboard-text font-bold">{appliance.estimatedMonthlyUsage}</p>
                        </div>
                        <div className="bg-dashboard-textSecondary/10 rounded-lg p-3">
                            <p className="text-xs text-dashboard-textSecondary">Monthly Cost</p>
                            <p className="text-dashboard-text font-bold">{appliance.estimatedCost}</p>
                        </div>
                        <div className="bg-dashboard-textSecondary/10 rounded-lg p-3">
                            <p className="text-xs text-dashboard-textSecondary">% of Bill</p>
                            <p className="text-dashboard-text font-bold">{appliance.percentageOfTotalBill}</p>
                        </div>
                        <div className="bg-dashboard-textSecondary/10 rounded-lg p-3">
                            <p className="text-xs text-dashboard-textSecondary">Usage Hours</p>
                            <p className="text-dashboard-text font-bold text-sm">{appliance.typicalUsageHours}</p>
                        </div>
                    </div>

                    {/* Tips & Recommendations */}
                    {(appliance.maintenanceTip || appliance.upgradeImpact) && (
                        <div className="mt-4 space-y-2">
                            {appliance.maintenanceTip && (
                                <div className="flex items-start gap-2 bg-blue-500/10 rounded-lg p-3">
                                    <CogIcon className="w-4 h-4 text-blue-400 mt-0.5" />
                                    <p className="text-sm text-blue-300">{appliance.maintenanceTip}</p>
                                </div>
                            )}
                            {appliance.upgradeImpact && (
                                <div className="flex items-start gap-2 bg-green-500/10 rounded-lg p-3">
                                    <SparklesIcon className="w-4 h-4 text-green-400 mt-0.5" />
                                    <p className="text-sm text-green-300">{appliance.upgradeImpact}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Feedback Buttons */}
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-dashboard-textSecondary">Is this detection accurate?</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onFeedback(appliance.name, true)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 text-xs transition-colors"
                            >
                                <CheckCircleIcon className="w-4 h-4" />
                                Yes
                            </button>
                            <button
                                onClick={() => onFeedback(appliance.name, false)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-xs transition-colors"
                            >
                                <XCircleIcon className="w-4 h-4" />
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main ApplianceBreakdown Component
const ApplianceBreakdown = ({ userId = 'user123' }) => {
    const [loading, setLoading] = useState(true);
    const [predictionData, setPredictionData] = useState(null);
    const [expandedCard, setExpandedCard] = useState(null);
    const [showAllRecommendations, setShowAllRecommendations] = useState(false);

    // Fetch prediction data
    const fetchPrediction = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/predict?userId=${userId}`);
            const data = await response.json();
            setPredictionData(data);
        } catch (error) {
            console.error('Failed to fetch appliance prediction:', error);
        }
        setLoading(false);
    }, [userId]);

    // Submit feedback
    const handleFeedback = async (applianceName, isCorrect) => {
        try {
            await fetch(`${API_BASE}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    applianceName,
                    isCorrect
                })
            });
            // Could show a toast notification here
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchPrediction();
    }, [fetchPrediction]);

    // Prepare pie chart data
    const pieData = predictionData?.likelyAppliances?.map((app, idx) => ({
        name: app.name,
        value: app.percentageValue,
        percentage: app.percentageValue,
        cost: app.costValue,
        color: COLORS[idx % COLORS.length]
    })) || [];

    // Add unidentified consumption to pie if significant
    if (predictionData?.unidentifiedConsumption?.percentageValue > 5) {
        pieData.push({
            name: 'Unidentified',
            value: predictionData.unidentifiedConsumption.percentageValue,
            percentage: predictionData.unidentifiedConsumption.percentageValue,
            cost: predictionData.unidentifiedConsumption.costValue,
            color: '#6b7280'
        });
    }

    // Loading state
    if (loading) {
        return (
            <div className="bg-dashboard-card rounded-2xl p-6 border border-dashboard-textSecondary/20">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <ArrowPathIcon className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
                        <p className="text-dashboard-textSecondary">Analyzing consumption patterns...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Collecting data state
    if (predictionData?.status === 'collecting') {
        return (
            <div className="bg-dashboard-card rounded-2xl p-6 border border-dashboard-textSecondary/20">
                <div className="flex items-center gap-3 mb-4">
                    <ChartPieIcon className="w-6 h-6 text-accent" />
                    <h3 className="text-lg font-bold text-dashboard-text">Appliance Breakdown</h3>
                </div>
                <div className="flex items-center justify-center h-48">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                            <SparklesIcon className="w-8 h-8 text-accent" />
                        </div>
                        <p className="text-dashboard-text font-medium mb-2">Learning Your Patterns</p>
                        <p className="text-dashboard-textSecondary text-sm max-w-xs">
                            We need about {predictionData.daysNeeded} more days of data to accurately identify your appliances.
                        </p>
                        <div className="mt-4 w-full bg-dashboard-textSecondary/20 rounded-full h-2 max-w-xs mx-auto">
                            <div
                                className="bg-accent h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (predictionData.dataPoints / 100) * 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-dashboard-textSecondary mt-2">
                            {predictionData.dataPoints} / 100 data points collected
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full overflow-hidden">
            {/* Main Card with Pie Chart */}
            <div className="bg-dashboard-card rounded-2xl p-6 border border-dashboard-textSecondary/20">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <ChartPieIcon className="w-6 h-6 text-accent" />
                        <h3 className="text-lg font-bold text-dashboard-text">Estimated Appliance Breakdown</h3>
                    </div>
                    <button
                        onClick={fetchPrediction}
                        disabled={loading}
                        className="p-2 hover:bg-dashboard-textSecondary/20 rounded-full transition-colors"
                    >
                        <ArrowPathIcon className={`w-5 h-5 text-white/70 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-dashboard-textSecondary/10 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-dashboard-text">
                            {predictionData?.summary?.appliancesDetected || 0}
                        </p>
                        <p className="text-xs text-dashboard-textSecondary">Appliances Detected</p>
                    </div>
                    <div className="bg-dashboard-textSecondary/10 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-dashboard-text">
                            {predictionData?.summary?.totalMonthlyUnits || 0}
                        </p>
                        <p className="text-xs text-dashboard-textSecondary">Monthly Units</p>
                    </div>
                    <div className="bg-dashboard-textSecondary/10 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-accent">
                            ₹{predictionData?.summary?.totalMonthlyCost || 0}
                        </p>
                        <p className="text-xs text-dashboard-textSecondary">Monthly Cost</p>
                    </div>
                    <div className="bg-dashboard-textSecondary/10 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-dashboard-text">
                            {predictionData?.summary?.baselineConsumption || 0}W
                        </p>
                        <p className="text-xs text-dashboard-textSecondary">Always-On Baseline</p>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                formatter={(value) => <span className="text-dashboard-textSecondary text-sm">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Appliance List */}
            <div className="bg-dashboard-card rounded-2xl p-6 border border-dashboard-textSecondary/20">
                <h3 className="text-lg font-bold text-dashboard-text mb-4">Detected Appliances</h3>
                <div className="space-y-3">
                    {predictionData?.likelyAppliances?.map((appliance, idx) => (
                        <ApplianceCard
                            key={appliance.name}
                            appliance={appliance}
                            index={idx}
                            isExpanded={expandedCard === idx}
                            onToggle={() => setExpandedCard(expandedCard === idx ? null : idx)}
                            onFeedback={handleFeedback}
                        />
                    ))}
                </div>

                {/* Edit Appliances Button */}
                <button className="w-full mt-4 flex items-center justify-center gap-2 p-3 border border-dashed border-dashboard-textSecondary/30 rounded-xl text-dashboard-textSecondary hover:border-accent hover:text-accent transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    Add Appliance Manually
                </button>
            </div>

            {/* Unidentified Consumption */}
            {predictionData?.unidentifiedConsumption?.percentageValue > 5 && (
                <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl p-6 border border-dashboard-textSecondary/20">
                    <h3 className="text-lg font-bold text-dashboard-text mb-4 flex items-center gap-2">
                        <span className="text-xl">❓</span>
                        Unidentified Consumption
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-dashboard-textSecondary/10 rounded-xl p-4">
                            <p className="text-xs text-dashboard-textSecondary">Power</p>
                            <p className="text-xl font-bold text-dashboard-text">
                                {predictionData.unidentifiedConsumption.power}
                            </p>
                        </div>
                        <div className="bg-dashboard-textSecondary/10 rounded-xl p-4">
                            <p className="text-xs text-dashboard-textSecondary">Monthly Cost</p>
                            <p className="text-xl font-bold text-orange-400">
                                {predictionData.unidentifiedConsumption.cost}
                            </p>
                        </div>
                        <div className="bg-dashboard-textSecondary/10 rounded-xl p-4">
                            <p className="text-xs text-dashboard-textSecondary">% of Bill</p>
                            <p className="text-xl font-bold text-dashboard-text">
                                {predictionData.unidentifiedConsumption.percentage}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-dashboard-textSecondary">
                        {predictionData.unidentifiedConsumption.reason}
                    </p>
                    <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg">
                        <p className="text-sm text-yellow-300">
                            💡 Tip: Check for devices on standby mode, chargers left plugged in, or older appliances not in our database.
                        </p>
                    </div>
                </div>
            )}

            {/* Recommendations Panel */}
            {predictionData?.topRecommendations?.length > 0 && (
                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-dashboard-textSecondary/20">
                    <h3 className="text-lg font-bold text-dashboard-text mb-4 flex items-center gap-2">
                        <LightBulbIcon className="w-5 h-5 text-green-400" />
                        Ways to Save Money
                    </h3>
                    <div className="space-y-3">
                        {(showAllRecommendations
                            ? predictionData.topRecommendations
                            : predictionData.topRecommendations.slice(0, 3)
                        ).map((rec, idx) => (
                            <div
                                key={idx}
                                className="flex items-start gap-3 bg-dashboard-textSecondary/10 rounded-xl p-4"
                            >
                                <span className="text-green-400 font-bold">{idx + 1}.</span>
                                <p className="text-sm text-dashboard-textSecondary">{rec}</p>
                            </div>
                        ))}
                    </div>
                    {predictionData.topRecommendations.length > 3 && (
                        <button
                            onClick={() => setShowAllRecommendations(!showAllRecommendations)}
                            className="mt-4 text-sm text-accent hover:underline"
                        >
                            {showAllRecommendations ? 'Show less' : `Show ${predictionData.topRecommendations.length - 3} more recommendations`}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ApplianceBreakdown;
