import React from 'react';
import Header from './Header';
import Footer from './Footer';

import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const Documentation: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900 relative">
            <Link to="/" className="fixed top-24 left-4 lg:left-8 z-40 hidden xl:flex items-center gap-2 text-gray-500 hover:text-primary transition-colors bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-100 group">
                <ArrowRightIcon className="h-4 w-4 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Home</span>
            </Link>
            <Header />
            <div className="pt-24 pb-12 container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <h1 className="text-4xl font-bold mb-8 text-primary">Project Documentation</h1>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">

                    <section>
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2">1. Executive Summary</h2>
                        <p className="text-gray-700 leading-relaxed">
                            SHEM is a low-cost, IoT-based system that measures mains voltage and current using ZMPT101B and SCT-013 sensors.
                            It computes real-time power and energy, shows the data on a local display, and streams it to a mobile dashboard (Blynk 2.0)
                            for alerts and basic automation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2">2. Problem Statement</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Conventional household meters provide delayed billing without actionable, per-minute visibility.
                            Users cannot detect abnormal consumption, compare appliances, or shift loads in time, leading to wastage and higher costs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2">3. Objectives</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Measure RMS voltage, RMS current, real power, and cumulative energy (kWh) accurately.</li>
                            <li>Display live metrics locally and on a mobile app; store rolling history and trigger alerts.</li>
                            <li>Provide a simple relay output to automate one deferrable appliance for off-peak shifting.</li>
                            <li>Validate accuracy within ±5% versus a reference meter.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2">4. System Architecture</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Hardware</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li><strong>Controller:</strong> ESP32 DevKit (Wi-Fi, dual-core).</li>
                                    <li><strong>Sensors:</strong> ZMPT101B (Voltage), SCT-013-030 (Current).</li>
                                    <li><strong>HMI:</strong> 16×2 I2C LCD, Blynk 2.0 Dashboard.</li>
                                    <li><strong>Actuators:</strong> 4-channel relay for appliance control.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Software</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li><strong>Firmware:</strong> ESP32 C++ (Arduino IDE) for RMS computation.</li>
                                    <li><strong>Cloud:</strong> Blynk 2.0 Datastreams & MQTT.</li>
                                    <li><strong>AI:</strong> Google Gemini API integration for usage analysis.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2">5. Bill of Materials (Indicative)</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm whitespace-nowrap">
                                <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Component</th>
                                        <th scope="col" className="px-6 py-3">Price (₹)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr><td className="px-6 py-3">ESP32 DevKit</td><td className="px-6 py-3">400</td></tr>
                                    <tr><td className="px-6 py-3">ZMPT101B AC Voltage Sensor</td><td className="px-6 py-3">70</td></tr>
                                    <tr><td className="px-6 py-3">SCT-013-030 Current Clamp</td><td className="px-6 py-3">342</td></tr>
                                    <tr><td className="px-6 py-3">I2C LCD 16×2</td><td className="px-6 py-3">255</td></tr>
                                    <tr><td className="px-6 py-3">4-Channel 5V Relay Module</td><td className="px-6 py-3">330</td></tr>
                                    <tr><td className="px-6 py-3">Total Estimated Cost</td><td className="px-6 py-3 font-bold">~2500</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2">6. Risks & Mitigations</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><strong>ADC Noise:</strong> Use integer-cycle windows and filtering.</li>
                            <li><strong>Calibration Drift:</strong> Periodically recalibrate ZMPT101B trimmers.</li>
                            <li><strong>Wi-Fi Dropouts:</strong> Local caching on ESP32 before retry.</li>
                            <li><strong>Safety:</strong> Strict isolation using transformers and CT clamps.</li>
                        </ul>
                    </section>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Documentation;
