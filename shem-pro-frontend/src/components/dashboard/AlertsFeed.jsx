import React from 'react';
import { ExclamationTriangleIcon, BoltIcon, BellIcon } from '@heroicons/react/24/solid';

const AlertsFeed = ({ alerts = [] }) => {
    // Mock alerts if none provided
    const displayAlerts = alerts.length > 0 ? alerts : [
        { id: 1, type: 'warning', message: 'Current consumption > 80% daily avg', time: '10 mins ago', icon: ExclamationTriangleIcon },
        { id: 2, type: 'info', message: 'System connected to SHEM Cloud', time: '2 hours ago', icon: BoltIcon },
        { id: 3, type: 'success', message: 'Energy saving mode active', time: '5 hours ago', icon: BellIcon },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-gray-400" />
                Notifications
            </h2>
            <div className="space-y-4">
                {displayAlerts.map((alert) => (
                    <div key={alert.id} className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className={`p-1.5 rounded-full mt-0.5 shrink-0
                            ${alert.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                alert.type === 'success' ? 'bg-green-100 text-green-600' :
                                    'bg-blue-100 text-blue-600'}`}>
                            <alert.icon className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 text-sm text-primary hover:text-primary-dark font-medium transition-colors">
                View All Notifications
            </button>
        </div>
    );
};

export default AlertsFeed;
