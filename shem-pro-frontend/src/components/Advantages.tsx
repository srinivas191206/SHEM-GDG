import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const Advantages: React.FC = () => {
    return (
        <section id="advantages" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Problem vs Solution */}
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose SHEM?</h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Conventional meters leave you in the dark. SHEM brings your energy usage to light.
                        </p>

                        <div className="space-y-6">
                            {/* Traditional Meter */}
                            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <XCircleIcon className="w-6 h-6 text-red-500" />
                                    <h3 className="font-bold text-gray-900">Traditional Meters</h3>
                                </div>
                                <ul className="space-y-2 text-gray-600 ml-9 list-disc">
                                    <li>Delayed billing without real-time visibility.</li>
                                    <li>Cannot detect abnormal consumption patterns.</li>
                                    <li>No way to identify appliance-specific wastage.</li>
                                </ul>
                            </div>

                            {/* SHEM Solution */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                    <h3 className="font-bold text-gray-900">SHEM IoT Meter</h3>
                                </div>
                                <ul className="space-y-2 text-gray-600 ml-9 list-disc">
                                    <li>Real-time telemetry and mobile dashboard.</li>
                                    <li>Live alerts for high usage.</li>
                                    <li>AI-driven analysis for load shifting.</li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right: Objectives Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-2xl hover:bg-gray-100 transition-colors">
                            <h3 className="text-xl font-bold text-primary mb-2">Measure</h3>
                            <p className="text-gray-600 text-sm">Accurate RMS voltage, current, and power factor tracking.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl hover:bg-gray-100 transition-colors">
                            <h3 className="text-xl font-bold text-primary mb-2">Display</h3>
                            <p className="text-gray-600 text-sm">Live metrics on local LCD and Blynk 2.0 mobile app.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl hover:bg-gray-100 transition-colors">
                            <h3 className="text-xl font-bold text-primary mb-2">Automate</h3>
                            <p className="text-gray-600 text-sm">Relay control for off-peak shifting of deferrable loads.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl hover:bg-gray-100 transition-colors">
                            <h3 className="text-xl font-bold text-primary mb-2">Validate</h3>
                            <p className="text-gray-600 text-sm">Proven accuracy within ±5% of reference meters.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Advantages;
