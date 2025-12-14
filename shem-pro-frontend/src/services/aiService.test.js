import { getAiInsights, getOptimizationSuggestions } from './aiService';

describe('AI Service Mock API', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('getAiInsights returns mock insights after a delay', async () => {
    const promise = getAiInsights();
    jest.advanceTimersByTime(1000);
    const result = await promise;
    expect(result.data).toEqual([
      "Your average usage increased by 12% this week compared to last week",
      "Peak consumption hours detected between 6–9 PM daily",
      "Your usage pattern suggests potential savings opportunities",
    ]);
  });

  test('getOptimizationSuggestions returns mock suggestions after a delay', async () => {
    const promise = getOptimizationSuggestions();
    jest.advanceTimersByTime(1000);
    const result = await promise;
    expect(result.data).toEqual([
      "Consider upgrading to energy-efficient appliances for long-term savings.",
      "Utilize smart plugs to schedule power-off times for idle electronics.",
      "Optimize your thermostat settings; a 1-degree change can save up to 3% on heating/cooling.",
      "Ensure proper insulation in your home to prevent heat loss/gain.",
      "Switch to LED lighting to reduce electricity consumption significantly.",
    ]);
  });
});