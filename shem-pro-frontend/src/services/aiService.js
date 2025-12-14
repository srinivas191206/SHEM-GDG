import api from './api';

export const getAiInsights = async () => {
  // Mock API call for AI insights
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          "Your average usage increased by 12% this week compared to last week",
          "Peak consumption hours detected between 6–9 PM daily",
          "Your usage pattern suggests potential savings opportunities",
        ],
      });
    }, 1000);
  });
};

export const getOptimizationSuggestions = async () => {
  // Mock API call for optimization suggestions
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          "Consider upgrading to energy-efficient appliances for long-term savings.",
          "Utilize smart plugs to schedule power-off times for idle electronics.",
          "Optimize your thermostat settings; a 1-degree change can save up to 3% on heating/cooling.",
          "Ensure proper insulation in your home to prevent heat loss/gain.",
          "Switch to LED lighting to reduce electricity consumption significantly.",
        ],
      });
    }, 1000);
  });
};