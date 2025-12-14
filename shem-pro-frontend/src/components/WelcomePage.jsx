import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="bg-primary p-8 text-center text-white">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-16 h-16 bg-white rounded-full text-primary flex items-center justify-center mx-auto mb-4"
                    >
                        <CheckCircleIcon className="w-10 h-10" />
                    </motion.div>
                    <h1 className="text-3xl font-bold mb-2">Welcome to SHEM Pro!</h1>
                    <p className="opacity-90">Your account has been successfully created.</p>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-semibold mb-2">Complete Your Profile</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Please fill out this form to help us customize your energy management experience.
                        </p>
                    </div>

                    <div className="w-full aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl mb-8 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <iframe
                            title="Onboarding Form"
                            src="https://docs.google.com/forms/d/e/1FAIpQLSfAWpXccFwalKbcPh1H2ZL-SG2yt65q6BVDjE30D-kHzKLYuw/viewform?embedded=true"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            marginHeight={0}
                            marginWidth={0}
                            className="rounded-xl"
                        >
                            Loading form...
                        </iframe>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-full shadow-lg transition-transform hover:-translate-y-0.5"
                        >
                            Continue to Dashboard
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default WelcomePage;
