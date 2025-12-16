import React, { useState, useEffect, useCallback } from 'react';
import {
    ExclamationTriangleIcon,
    BellAlertIcon,
    CheckCircleIcon,
    XMarkIcon,
    ArrowPathIcon,
    ChartBarIcon,
    AdjustmentsHorizontalIcon,
    InformationCircleIcon,
    ClockIcon,
    BoltIcon,
    CogIcon
} from '@heroicons/react/24/solid';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/anomaly`
    : 'http://localhost:5000/api/anomaly';

// Confidence color mapping
const getConfidenceColor = (confidence) => {
    switch (confidence) {
        case 'high': return { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', icon: '🚨' };
        case 'medium': return { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', icon: '⚠️' };
        case 'low': return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', icon: '⚡' };
        default: return { bg: 'bg-gray-500/20', border: 'border-gray-500/50', text: 'text-gray-400', icon: '📊' };
    }
};

// Status badge component
const StatusBadge = ({ status }) => {
    const statusConfig = {
        detected: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Detected' },
        acknowledged: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Acknowledged' },
        resolved: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Resolved' },
        false_positive: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'False Positive' }
    };
    const config = statusConfig[status] || statusConfig.detected;

    return (
        <span className={`px-2 py-1 rounded-full text-xs ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
};

// Time ago helper
const timeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

// Format timestamp for display
const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

// Anomaly Details Modal
const AnomalyDetailsModal = ({ isOpen, onClose, anomaly, onReport }) => {
    const [selectedAppliance, setSelectedAppliance] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen || !anomaly) return null;

    const colors = getConfidenceColor(anomaly.confidence);

    // Possible causes with likelihood percentages
    const possibleCauses = [
        { cause: 'AC overcooling', likelihood: 40 },
        { cause: 'Water heater still on', likelihood: 35 },
        { cause: 'TV/Equipment left on', likelihood: 25 }
    ];

    const appliances = ['AC', 'Water Heater', 'Washing Machine', 'Refrigerator', 'TV', 'Other'];

    const handleReport = async (wasNormal) => {
        setSubmitting(true);
        await onReport(anomaly.id, selectedAppliance, wasNormal);
        setSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-dashboard-card rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-auto border border-dashboard-textSecondary/20" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${colors.bg}`}>
                            <ExclamationTriangleIcon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-dashboard-text">Anomaly Details</h3>
                            <p className={`text-sm ${colors.text} capitalize`}>{anomaly.confidence} Confidence</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-dashboard-textSecondary/20 rounded-full transition-colors">
                        <XMarkIcon className="w-5 h-5 text-white/70" />
                    </button>
                </div>

                {/* What Happened */}
                <div className="bg-dashboard-textSecondary/10 rounded-xl p-4 mb-4">
                    <h4 className="text-sm font-medium text-dashboard-textSecondary mb-2">What Happened</h4>
                    <p className="text-dashboard-text">
                        Consumption was <span className="font-bold text-accent">{anomaly.consumption}W</span> at{' '}
                        <span className="font-bold">{formatTimestamp(anomaly.timestamp)}</span>
                    </p>
                </div>

                {/* Deviation Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-dashboard-textSecondary/10 rounded-xl p-4">
                        <p className="text-xs text-dashboard-textSecondary mb-1">Normal Range</p>
                        <p className="text-dashboard-text font-bold">
                            Typically varies at this hour
                        </p>
                    </div>
                    <div className={`rounded-xl p-4 ${colors.bg}`}>
                        <p className="text-xs text-dashboard-textSecondary mb-1">Deviation</p>
                        <p className={`font-bold ${colors.text}`}>{anomaly.deviation}</p>
                    </div>
                </div>

                {/* Possible Causes */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-dashboard-text mb-3">🤖 AI-Suggested Causes</h4>
                    <div className="space-y-2">
                        {possibleCauses.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="flex-1 bg-dashboard-textSecondary/10 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-accent/70 transition-all duration-500"
                                        style={{ width: `${item.likelihood}%` }}
                                    />
                                </div>
                                <span className="text-sm text-dashboard-textSecondary min-w-[120px]">
                                    {item.cause} ({item.likelihood}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Estimated Extra Cost */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <span className="text-dashboard-textSecondary">Estimated Extra Cost</span>
                        <span className="text-red-400 font-bold text-lg">₹12 for this hour</span>
                    </div>
                </div>

                {/* User Feedback Section */}
                <div className="border-t border-dashboard-textSecondary/20 pt-4">
                    <h4 className="text-sm font-medium text-dashboard-text mb-3">What were you actually running?</h4>

                    <select
                        value={selectedAppliance}
                        onChange={(e) => setSelectedAppliance(e.target.value)}
                        className="w-full bg-dashboard-textSecondary/10 border border-dashboard-textSecondary/20 rounded-xl p-3 text-dashboard-text mb-4 focus:outline-none focus:border-accent"
                    >
                        <option value="">Select an appliance...</option>
                        {appliances.map(app => (
                            <option key={app} value={app}>{app}</option>
                        ))}
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleReport(true)}
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 rounded-xl transition-colors text-green-400 text-sm font-medium disabled:opacity-50"
                        >
                            <CheckCircleIcon className="w-4 h-4" />
                            Yes, this was normal
                        </button>
                        <button
                            onClick={() => handleReport(false)}
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors text-red-400 text-sm font-medium disabled:opacity-50"
                        >
                            <ExclamationTriangleIcon className="w-4 h-4" />
                            This was a problem
                        </button>
                    </div>
                    <p className="text-xs text-dashboard-textSecondary text-center mt-3">
                        Your feedback helps improve detection accuracy
                    </p>
                </div>
            </div>
        </div>
    );
};

// Settings Modal
const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
    const [sensitivity, setSensitivity] = useState(settings?.sensitivity || 50);
    const [emailAlerts, setEmailAlerts] = useState(settings?.emailAlerts || false);
    const [smsAlerts, setSmsAlerts] = useState(settings?.smsAlerts || false);
    const [frequency, setFrequency] = useState(settings?.frequency || 'immediate');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ sensitivity, emailAlerts, smsAlerts, frequency });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-dashboard-card rounded-2xl p-6 max-w-md w-full border border-dashboard-textSecondary/20" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-dashboard-text flex items-center gap-2">
                        <CogIcon className="w-6 h-6 text-accent" />
                        Anomaly Detection Settings
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-dashboard-textSecondary/20 rounded-full transition-colors">
                        <XMarkIcon className="w-5 h-5 text-white/70" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Sensitivity Slider */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm text-dashboard-text">Detection Sensitivity</label>
                            <span className="text-sm text-accent">{sensitivity < 33 ? 'Low' : sensitivity < 66 ? 'Medium' : 'High'}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sensitivity}
                            onChange={e => setSensitivity(parseInt(e.target.value))}
                            className="w-full accent-accent"
                        />
                        <div className="flex justify-between text-xs text-dashboard-textSecondary mt-1">
                            <span>Only extreme</span>
                            <span>Minor deviations</span>
                        </div>
                    </div>

                    {/* Notification Preferences */}
                    <div>
                        <h4 className="text-sm font-medium text-dashboard-text mb-3">Notification Preferences</h4>

                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-3 bg-dashboard-textSecondary/10 rounded-xl cursor-pointer">
                                <span className="text-sm text-dashboard-text">Email alerts for high-confidence anomalies</span>
                                <input
                                    type="checkbox"
                                    checked={emailAlerts}
                                    onChange={e => setEmailAlerts(e.target.checked)}
                                    className="w-5 h-5 accent-accent"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 bg-dashboard-textSecondary/10 rounded-xl cursor-pointer">
                                <span className="text-sm text-dashboard-text">SMS alerts</span>
                                <input
                                    type="checkbox"
                                    checked={smsAlerts}
                                    onChange={e => setSmsAlerts(e.target.checked)}
                                    className="w-5 h-5 accent-accent"
                                />
                            </label>

                            <div className="p-3 bg-dashboard-textSecondary/10 rounded-xl">
                                <label className="text-sm text-dashboard-text block mb-2">Alert Frequency</label>
                                <select
                                    value={frequency}
                                    onChange={e => setFrequency(e.target.value)}
                                    className="w-full bg-dashboard-card border border-dashboard-textSecondary/20 rounded-lg p-2 text-dashboard-text focus:outline-none focus:border-accent"
                                >
                                    <option value="immediate">Immediate</option>
                                    <option value="daily">Daily Summary</option>
                                    <option value="weekly">Weekly Summary</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full py-3 bg-accent hover:bg-accent/80 rounded-xl transition-colors text-white font-medium"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main AnomalyAlerts Component
const AnomalyAlerts = ({ userId = 'user123' }) => {
    const [loading, setLoading] = useState(true);
    const [anomalies, setAnomalies] = useState([]);
    const [summary, setSummary] = useState(null);
    const [liveAlert, setLiveAlert] = useState(null);
    const [selectedAnomaly, setSelectedAnomaly] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        sensitivity: 50,
        emailAlerts: false,
        smsAlerts: false,
        frequency: 'immediate'
    });

    // Fetch anomaly history
    const fetchAnomalyHistory = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/history?userId=${userId}&days=7`);
            const data = await response.json();

            if (data.anomalies) {
                setAnomalies(data.anomalies);
                setSummary(data.summary);

                // Set most recent unacknowledged anomaly as live alert
                const recentUnack = data.anomalies.find(a => a.status === 'detected');
                if (recentUnack) {
                    setLiveAlert(recentUnack);
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch anomaly history:', error);
            setLoading(false);
        }
    }, [userId]);

    // Report feedback on anomaly
    const reportAnomaly = async (anomalyId, appliance, wasNormal) => {
        try {
            await fetch(`${API_BASE}/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    anomalyId,
                    appliance,
                    wasNormal
                })
            });
            // Refresh data after reporting
            fetchAnomalyHistory();
        } catch (error) {
            console.error('Failed to report anomaly:', error);
        }
    };

    // Acknowledge live alert
    const acknowledgeAlert = () => {
        if (liveAlert) {
            reportAnomaly(liveAlert.id, '', true);
            setLiveAlert(null);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchAnomalyHistory();
    }, [fetchAnomalyHistory]);

    // Poll for updates every 5 minutes
    useEffect(() => {
        const interval = setInterval(fetchAnomalyHistory, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchAnomalyHistory]);

    // Trend chart data - group anomalies by day
    const trendData = React.useMemo(() => {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

            const count = anomalies.filter(a => {
                const aDate = new Date(a.timestamp);
                return aDate.toDateString() === date.toDateString();
            }).length;

            last7Days.push({ date: dateStr, count });
        }
        return last7Days;
    }, [anomalies]);

    // Recommendations based on anomalies
    const recommendations = React.useMemo(() => {
        const recs = [];

        if (summary?.mostCommonHour !== null && summary?.mostCommonHour !== undefined) {
            const hour = summary.mostCommonHour;
            const hourStr = hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
            recs.push({
                icon: '🕐',
                text: `Most anomalies occur around ${hourStr}. Consider reviewing your usage patterns during this time.`
            });
        }

        if (summary?.mostCommonCause) {
            if (summary.mostCommonCause.toLowerCase().includes('ac')) {
                recs.push({
                    icon: '❄️',
                    text: 'Your AC seems to run longer than normal. Consider servicing or adjusting thermostat settings.'
                });
            }
            if (summary.mostCommonCause.toLowerCase().includes('heater')) {
                recs.push({
                    icon: '🔥',
                    text: 'Frequent heater-related spikes detected. Check if heater timer is working correctly.'
                });
            }
        }

        if (anomalies.length > 5) {
            recs.push({
                icon: '⚡',
                text: 'Multiple anomalies detected this week. Consider scheduling an appliance health check.'
            });
        }

        if (recs.length === 0) {
            recs.push({
                icon: '✅',
                text: 'No specific concerns detected. Your consumption patterns look healthy!'
            });
        }

        return recs;
    }, [summary, anomalies]);

    return (
        <div className="space-y-6 w-full overflow-hidden">
            {/* Live Alert Banner */}
            {liveAlert && (
                <div className={`rounded-2xl p-4 border-2 animate-pulse ${getConfidenceColor(liveAlert.confidence).bg} ${getConfidenceColor(liveAlert.confidence).border}`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-xl">
                                <BellAlertIcon className={`w-6 h-6 ${getConfidenceColor(liveAlert.confidence).text}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-dashboard-text flex items-center gap-2">
                                    {getConfidenceColor(liveAlert.confidence).icon} High Power Alert!
                                </h3>
                                <p className="text-sm text-dashboard-textSecondary">
                                    Your consumption is {liveAlert.deviation} from normal
                                </p>
                                <p className="text-xs text-dashboard-textSecondary mt-1">
                                    <ClockIcon className="w-3 h-3 inline mr-1" />
                                    {timeAgo(liveAlert.timestamp)}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedAnomaly(liveAlert)}
                                className="px-3 py-2 bg-accent/20 hover:bg-accent/30 rounded-lg text-accent text-sm font-medium transition-colors"
                            >
                                View Details
                            </button>
                            <button
                                onClick={acknowledgeAlert}
                                className="px-3 py-2 bg-dashboard-textSecondary/20 hover:bg-dashboard-textSecondary/30 rounded-lg text-dashboard-text text-sm font-medium transition-colors"
                            >
                                Acknowledge
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                {/* Anomaly History Card */}
                <div className="bg-dashboard-card rounded-2xl p-4 md:p-6 border border-dashboard-textSecondary/20 min-w-0">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-dashboard-text flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                            Detected Issues (Last 7 Days)
                        </h3>
                        <button
                            onClick={fetchAnomalyHistory}
                            disabled={loading}
                            className="p-2 hover:bg-dashboard-textSecondary/20 rounded-full transition-colors"
                        >
                            <ArrowPathIcon className={`w-5 h-5 text-white/70 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {/* Count Badge */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                            {anomalies.length} anomalies detected
                        </span>
                        {summary?.avgDeviationPercent && (
                            <span className="px-3 py-1 bg-dashboard-textSecondary/20 text-dashboard-textSecondary rounded-full text-sm">
                                Avg deviation: {summary.avgDeviationPercent}%
                            </span>
                        )}
                    </div>

                    {/* Anomaly List */}
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {anomalies.length === 0 ? (
                            <div className="text-center py-8 text-dashboard-textSecondary">
                                <CheckCircleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No anomalies detected</p>
                            </div>
                        ) : (
                            anomalies.map((anomaly, idx) => {
                                const colors = getConfidenceColor(anomaly.confidence);
                                return (
                                    <div
                                        key={anomaly.id || idx}
                                        onClick={() => setSelectedAnomaly(anomaly)}
                                        className={`p-4 rounded-xl ${colors.bg} border ${colors.border} cursor-pointer hover:scale-[1.01] transition-transform`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span>{colors.icon}</span>
                                                <span className="text-sm text-dashboard-text font-medium">
                                                    {formatTimestamp(anomaly.timestamp)}
                                                </span>
                                            </div>
                                            <StatusBadge status={anomaly.status} />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="min-w-0">
                                                <p className="text-dashboard-text font-bold">{anomaly.consumption}W</p>
                                                <p className={`text-sm ${colors.text}`}>{anomaly.deviation}</p>
                                            </div>
                                            <p className="text-xs text-dashboard-textSecondary max-w-[100px] text-right truncate flex-shrink-0">
                                                {anomaly.possibleCause}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Trend Chart Card */}
                <div className="bg-dashboard-card rounded-2xl p-4 md:p-6 border border-dashboard-textSecondary/20 min-w-0">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-dashboard-text flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 text-accent" />
                            Anomalies Over Time
                        </h3>
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-2 hover:bg-dashboard-textSecondary/20 rounded-full transition-colors"
                        >
                            <AdjustmentsHorizontalIcon className="w-5 h-5 text-white/70" />
                        </button>
                    </div>

                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                                />
                                <YAxis
                                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(30,30,40,0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                    labelStyle={{ color: 'white' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#f97316"
                                    strokeWidth={2}
                                    dot={{ fill: '#f97316', strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Trend Summary */}
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                        {trendData[6]?.count > trendData[0]?.count ? (
                            <>
                                <span className="text-red-400">📈</span>
                                <span className="text-dashboard-textSecondary">Anomalies are increasing - consider investigating</span>
                            </>
                        ) : trendData[6]?.count < trendData[0]?.count ? (
                            <>
                                <span className="text-green-400">📉</span>
                                <span className="text-dashboard-textSecondary">Anomalies are decreasing - great job!</span>
                            </>
                        ) : (
                            <>
                                <span className="text-gray-400">➡️</span>
                                <span className="text-dashboard-textSecondary">Anomaly rate is stable</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Recommendations Panel */}
            <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-2xl p-6 border border-dashboard-textSecondary/20">
                <h3 className="text-lg font-bold text-dashboard-text flex items-center gap-2 mb-4">
                    <InformationCircleIcon className="w-5 h-5 text-accent" />
                    AI Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((rec, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-3 bg-dashboard-textSecondary/10 rounded-xl p-4"
                        >
                            <span className="text-2xl">{rec.icon}</span>
                            <p className="text-sm text-dashboard-textSecondary">{rec.text}</p>
                        </div>
                    ))}
                </div>

                {/* Link to Appliance Health Check */}
                <div className="mt-4 flex justify-center">
                    <button className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 rounded-xl transition-colors text-accent text-sm font-medium">
                        <BoltIcon className="w-4 h-4" />
                        Schedule Appliance Health Check
                        <span className="text-xs opacity-70">(Coming Soon)</span>
                    </button>
                </div>
            </div>

            {/* Modals */}
            <AnomalyDetailsModal
                isOpen={!!selectedAnomaly}
                onClose={() => setSelectedAnomaly(null)}
                anomaly={selectedAnomaly}
                onReport={reportAnomaly}
            />
            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                settings={settings}
                onSave={setSettings}
            />
        </div>
    );
};

export default AnomalyAlerts;
