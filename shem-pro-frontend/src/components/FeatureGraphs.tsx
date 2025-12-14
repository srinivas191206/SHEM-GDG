import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';

const powerData = [
    { time: '00:00', power: 300 },
    { time: '04:00', power: 250 },
    { time: '08:00', power: 1200 }, // Morning peak
    { time: '12:00', power: 800 },
    { time: '16:00', power: 1500 }, // Evening peak
    { time: '20:00', power: 2200 },
    { time: '23:59', power: 400 },
];

const applianceData = [
    { name: 'HVAC', value: 45, color: '#3B82F6' }, // Blue
    { name: 'Lighting', value: 15, color: '#F59E0B' }, // Amber
    { name: 'Kitchen', value: 25, color: '#EF4444' }, // Red
    { name: 'Others', value: 15, color: '#10B981' }, // Green
];

const FeatureGraphs: React.FC = () => {
    return (
        <section id="features-graphs" className="py-20 bg-neutralBg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Real-Time Analytics</h2>
                    <p className="text-xl text-gray-600">Visualize your energy footprint instantly.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Chart 1: Daily Power Consumption */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Daily Power Consumption (Watts)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={powerData}>
                                    <defs>
                                        <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="power" stroke="#4CAF50" fillOpacity={1} fill="url(#colorPower)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Real-time tracking allows early detection of abnormal spikes.
                        </p>
                    </motion.div>

                    {/* Chart 2: Appliance Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Appliance Usage Breakdown</h3>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={applianceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {applianceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Identify high-draw appliances and optimized load shifting.
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default FeatureGraphs;
