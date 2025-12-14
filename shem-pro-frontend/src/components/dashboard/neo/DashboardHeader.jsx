import React, { useState, useEffect } from 'react';
import { BellIcon, ArrowRightStartOnRectangleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext'; // Import Context

const DashboardHeader = ({ title }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { logout, user } = useAuth();
    const { notifications, unreadCount, clearAll, markAsRead } = useNotification(); // Use Context

    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="flex justify-between items-center py-6 px-8 bg-dashboard-bg/95 backdrop-blur-sm sticky top-0 z-40 border-b border-[#2d3142]">
            {/* Left: Title & Date */}
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
                <div className="flex items-center gap-4 text-sm text-dashboard-textSecondary">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-accent"></span>
                        {format(currentDate, 'MMMM do, h:mm a')}
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <button className="relative text-dashboard-textSecondary hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                        <BellIcon className="h-6 w-6" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-dashboard-bg animate-pulse"></span>
                        )}
                    </button>

                    {/* Real Notification Dropdown */}
                    <div className="hidden group-hover:block absolute right-0 mt-2 w-80 bg-dashboard-card border border-white/10 rounded-xl shadow-xl p-4 z-50">
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                            <span className="text-sm font-bold text-white">Notifications ({unreadCount})</span>
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="text-xs text-dashboard-textSecondary hover:text-dashboard-danger flex items-center gap-1"
                                >
                                    <TrashIcon className="w-3 h-3" /> Clear
                                </button>
                            )}
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <p className="text-xs text-center text-gray-500 py-4">No new notifications</p>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`text-xs p-3 rounded-lg border border-white/5 transition-colors ${n.type === 'error' ? 'bg-red-900/20 text-red-200' :
                                                n.type === 'success' ? 'bg-green-900/20 text-green-200' :
                                                    'bg-white/5 text-gray-300'
                                            }`}
                                    >
                                        <p className="font-medium">{n.message}</p>
                                        <p className="text-[10px] opacity-60 mt-1 text-right">
                                            {format(new Date(n.timestamp), 'h:mm a')}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-700">
                    <img
                        src={user?.profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-9 h-9 rounded-full border border-gray-600"
                    />
                    <button
                        onClick={logout}
                        className="p-2 text-dashboard-textSecondary hover:text-dashboard-danger transition-colors bg-white/5 rounded-lg hover:bg-white/10"
                        title="Logout"
                    >
                        <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
