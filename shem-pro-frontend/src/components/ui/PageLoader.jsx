import React from 'react';
import { BoltIcon } from '@heroicons/react/24/solid';

const PageLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-dashboard-bg">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-dashboard-card border-t-accent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <BoltIcon className="h-6 w-6 text-accent animate-pulse" />
                </div>
            </div>
            <p className="mt-4 text-dashboard-textSecondary font-semibold tracking-wider animate-pulse">LOADING SHEM...</p>
        </div>
    );
};

export default PageLoader;
