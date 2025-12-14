import React from 'react';

const ActivityTimeline = ({ data }) => {
  console.log("ActivityTimeline received data:", data);
  if (!data) {
    return <div className="bg-gray-800 p-6 rounded-lg shadow-neumorphic-light dark:shadow-neumorphic-dark h-96"><h2 className="text-xl font-bold mb-4 text-[#007bff]">Hourly Usage Activity</h2><p className="text-gray-400">No activity data available.</p></div>;
  }
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-neumorphic-light dark:shadow-neumorphic-dark h-96">
      <h2 className="text-xl font-bold mb-4 text-[#007bff]">Hourly Usage Activity</h2>
      <div className="overflow-y-auto h-full pr-2">
        {data.length > 0 ? (
          <ul className="space-y-4">
            {data.map((item, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-[#007bff] rounded-full flex-shrink-0 shadow-inner-neumorphic-light dark:shadow-inner-neumorphic-dark"></div>
                <div>
                  <p className="text-gray-300 text-sm">{item.time}</p>
                  <p className="text-white font-medium">Power: {item.power} W, Energy: {item.energy} kWh</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center mt-12">No hourly usage data available.</p>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;