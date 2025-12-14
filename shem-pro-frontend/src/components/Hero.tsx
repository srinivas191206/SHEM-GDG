import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CpuChipIcon, ChartBarIcon, SignalIcon } from '@heroicons/react/24/solid';
import windTurbineBg from '../assets/wind-turbine-hero.png';

const Hero: React.FC = () => {
    return (
        <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={windTurbineBg}
                    alt="Wind Turbine"
                    className="w-full h-full object-cover object-right opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-50/20 to-blue-50/50 mix-blend-overlay"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Smart Home <span className="inline-block animate-spin-slow text-primary">⚡</span> Energy Manager (SHEM)
                        </h1>
                        <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-lg">
                            Real-time energy monitoring with IoT precision. Powered by ESP32, detailed analytics, and Gemini AI for smarter consumption.
                        </p>

                        <Link to="/register">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group flex items-center gap-3 px-8 py-4 bg-primary text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-primary-dark"
                            >
                                Get Started
                                <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
                                    <ArrowRightIcon className="h-5 w-5" />
                                </div>
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Right Content - Floating Hardware Specs */}
                    <div className="relative h-[600px] hidden lg:block">
                        {/* Card 1: Processor */}
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="absolute top-10 right-20 bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-xl max-w-xs text-center"
                        >
                            <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CpuChipIcon className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">ESP32</div>
                            <div className="text-gray-800 font-medium">Dual-Core Controller</div>
                        </motion.div>

                        {/* Card 2: AI Power */}
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-xl max-w-xs text-center"
                        >
                            <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ChartBarIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="text-gray-800 font-medium mb-1">Real-time Analysis</div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">95%+</div>
                            <div className="text-gray-800 text-sm">Accuracy with AI</div>
                        </motion.div>

                        {/* Card 3: Connectivity */}
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="absolute bottom-20 right-10 bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-xl max-w-xs text-center"
                        >
                            <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <SignalIcon className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="text-gray-800 font-medium mb-1">IoT Connectivity</div>
                            <div className="text-2xl font-bold text-gray-900">WiFi + MQTT</div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
