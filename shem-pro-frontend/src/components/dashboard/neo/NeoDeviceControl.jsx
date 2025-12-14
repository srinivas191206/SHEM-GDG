import React, { useState } from 'react';
import { LightBulbIcon, BoltIcon, ComputerDesktopIcon, EllipsisHorizontalIcon, SunIcon } from '@heroicons/react/24/solid';

const DeviceCard = ({ name, icon: Icon, isOn, onToggle }) => (
    <div className={`bg-dashboard-card rounded-xl p-4 border transition-all duration-300 ${isOn ? 'border-accent/50 shadow-[0_0_15px_rgba(247,181,41,0.1)]' : 'border-white/5 opacity-80'}`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${isOn ? 'bg-accent text-dashboard-bg' : 'bg-white/5 text-gray-400'}`}>
                <Icon className="h-6 w-6" />
            </div>

            <button
                onClick={onToggle}
                className={`${isOn ? 'bg-accent' : 'bg-gray-700'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
            >
                <span
                    className={`${isOn ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
            </button>
        </div>

        <div>
            <h4 className="font-bold text-white text-sm">{name}</h4>
            <p className="text-dashboard-textSecondary text-xs">{isOn ? 'Active' : 'Off'}</p>
        </div>
    </div>
);

const NeoDeviceControl = () => {
    const [devices, setDevices] = useState([
        { id: 1, name: 'Living Room Lights', icon: LightBulbIcon, isOn: true },
        { id: 2, name: 'AC Master Bedroom', icon: SunIcon, isOn: false },
        { id: 3, name: 'Smart TV', icon: ComputerDesktopIcon, isOn: true },
        { id: 4, name: 'Workstation', icon: BoltIcon, isOn: true },
    ]);

    const toggleDevice = (id) => {
        setDevices(devices.map(d => d.id === id ? { ...d, isOn: !d.isOn } : d));
    };

    return (
        <div className="bg-dashboard-card rounded-xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-lg">Quick Controls</h3>
                <button className="p-1.5 hover:bg-white/5 rounded-lg text-dashboard-textSecondary transition-colors">
                    <EllipsisHorizontalIcon className="h-6 w-6" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {devices.map(device => (
                    <DeviceCard
                        key={device.id}
                        {...device}
                        onToggle={() => toggleDevice(device.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default NeoDeviceControl;
