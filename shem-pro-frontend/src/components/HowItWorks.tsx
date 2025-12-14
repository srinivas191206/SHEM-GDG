import React from 'react';
import { motion } from 'framer-motion';
import { BoltIcon, CpuChipIcon, CloudIcon, SparklesIcon } from '@heroicons/react/24/outline';

const steps = [
    {
        id: 1,
        title: 'Precision Sensing',
        description: 'ZMPT101B and SCT-013 sensors measure RMS voltage and current with high accuracy.',
        icon: <BoltIcon className="w-8 h-8 text-white" />,
        color: 'bg-blue-500',
    },
    {
        id: 2,
        title: 'Intelligent Processing',
        description: 'ESP32 controller computes real-time power, energy, and power factor.',
        icon: <CpuChipIcon className="w-8 h-8 text-white" />,
        color: 'bg-purple-500',
    },
    {
        id: 3,
        title: 'Smart Connectivity',
        description: 'Data streams via WiFi/MQTT to the Blynk 2.0 mobile dashboard.',
        icon: <CloudIcon className="w-8 h-8 text-white" />,
        color: 'bg-cyan-500',
    },
    {
        id: 4,
        title: 'AI Analysis',
        description: 'Gemini AI integration analyzes usage patterns for actionable insights.',
        icon: <SparklesIcon className="w-8 h-8 text-white" />,
        color: 'bg-green-500',
    },
];

const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">How SHEM Works</h2>
                    <p className="text-xl text-gray-600">From raw data to smart energy decisions.</p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 transform -translate-y-1/2"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                            >
                                <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mb-6 shadow-md`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
