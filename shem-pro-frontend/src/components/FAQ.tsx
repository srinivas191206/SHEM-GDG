
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

const faqs = [
    {
        question: "What exactly does SHEM do?",
        answer: "SHEM (Smart Home Energy Manager) is an IoT-based system that measures voltage, current, and real-time power consumption of your home appliances. It provides actionable insights via a mobile dashboard to help you save energy."
    },
    {
        question: "How accurate are the measurements?",
        answer: "We typically achieve accuracy within ±5% compared to standard utility meters. We use precision ZMPT101B voltage sensors and SCT-013 current transformers, calibrated against reference standards."
    },
    {
        question: "Can it control my home appliances?",
        answer: "Yes! SHEM includes a 4-channel relay module. It can automatically turn off specific deferrable loads (like water heaters or pumps) during peak hours to reduce costs."
    },
    {
        question: "What happens if my Wi-Fi disconnects?",
        answer: "The ESP32 controller continues to monitor usage locally. It handles intermittent connections gracefully and will push the latest data to the Blynk dashboard once connectivity is restored."
    },
    {
        question: "Is it safe to install in my home?",
        answer: "Absolutely. We prioritize safety by using non-invasive CT clamps (no cutting wires needed) and isolation transformers for voltage sensing, ensuring high-voltage mains are kept separate from the logic circuits."
    },
    {
        question: "How can I view my data?",
        answer: "You can view live metrics like RMS Voltage, Current, and Power Factor on the local LCD screen installed with the device, or track historical charts and get alerts on the Blynk 2.0 mobile app."
    }
];

const FAQ: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
                        Frequently Asked Questions
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900">
                        Quick Answers: Everything You Need to Know.
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                                <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeIndex === index ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {activeIndex === index ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
