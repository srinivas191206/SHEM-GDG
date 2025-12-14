import React, { useState } from 'react';
import { motion } from 'framer-motion';
// @ts-ignore
import { Switch } from '@headlessui/react';
// @ts-ignore
import { LightBulbIcon, PowerIcon, TvIcon, ComputerDesktopIcon } from '@heroicons/react/24/solid';

const DeviceControl = () => {
    // Mock state for devices
    const [devices, setDevices] = useState([
        { id: 1, name: 'Main Lights', icon: LightBulbIcon, isOn: true, power: '12W' },
        { id: 2, name: 'AC Unit', icon: PowerIcon, isOn: false, power: '0W' },
        { id: 3, name: 'Smart TV', icon: TvIcon, isOn: false, power: '0W' },
        { id: 4, name: 'Workstation', icon: ComputerDesktopIcon, isOn: true, power: '150W' },
    ]);

    const toggleDevice = (id) => {
        setDevices(devices.map(device =>
            device.id === id ? { ...device, isOn: !device.isOn, power: !device.isOn ? (device.id === 2 ? '1200W' : device.id === 3 ? '85W' : '150W') : '0W' } : device
        ));
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <PowerIcon className="h-6 w-6 text-primary" />
                Device Control
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {devices.map((device) => (
                    <div
                        key={device.id}
                        className={`p-4 rounded-xl border transition-all duration-300 ${device.isOn ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-gray-50 border-gray-100 dark:bg-gray-700 dark:border-gray-600'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-lg ${device.isOn ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200' : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'}`}>
                                <device.icon className="h-6 w-6" />
                            </div>
                            <Switch
                                checked={device.isOn}
                                onChange={() => toggleDevice(device.id)}
                                className={`${device.isOn ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                            >
                                <span className="sr-only">Enable notifications</span>
                                <span
                                    className={`${device.isOn ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                            </Switch>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{device.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{device.isOn ? `On • ${device.power}` : 'Off'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeviceControl;
