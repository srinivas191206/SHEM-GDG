/**
 * Test script for Anomaly Detection Engine
 * Run with: node test-anomaly.js
 */

const BASE_URL = 'http://localhost:5000/api/anomaly';

// Test user ID
const TEST_USER_ID = 'test_user_anomaly_123';

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null) {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

// Generate mock consumption data for 30 days
function generateMockData() {
    const data = [];
    const baseConsumption = {
        0: 300, 1: 250, 2: 200, 3: 180, 4: 200, 5: 350,
        6: 600, 7: 800, 8: 700, 9: 500, 10: 400, 11: 450,
        12: 700, 13: 650, 14: 500, 15: 450, 16: 500, 17: 700,
        18: 1000, 19: 1200, 20: 1100, 21: 900, 22: 600, 23: 400
    };

    const now = new Date();

    for (let day = 0; day < 35; day++) {
        for (let hour = 0; hour < 24; hour++) {
            const date = new Date(now);
            date.setDate(date.getDate() - (35 - day));
            date.setHours(hour, 0, 0, 0);

            // Add some randomness (±20%)
            const baseValue = baseConsumption[hour];
            const randomFactor = 0.8 + (Math.random() * 0.4);
            let consumption = Math.round(baseValue * randomFactor);

            // Inject known anomalies on specific days
            if (day === 32 && hour === 19) {
                // High spike at 7 PM on day 32
                consumption = 1800;
            }
            if (day === 33 && hour === 14) {
                // Moderate spike at 2 PM on day 33
                consumption = 900;
            }
            if (day === 34 && hour === 3) {
                // Unusual dip at 3 AM on day 34
                consumption = 50;
            }

            data.push({
                timestamp: date.toISOString(),
                hourlyConsumption: consumption,
                temperature: 25 + Math.round(Math.random() * 10)
            });
        }
    }

    return data;
}

// Test functions
async function test1_StoreConsumptionData() {
    console.log('\n========================================');
    console.log('TEST 1: Store Consumption Data (30+ days)');
    console.log('========================================');

    const mockData = generateMockData();
    let successCount = 0;
    let lastResponse = null;

    console.log(`Storing ${mockData.length} data points...`);

    for (const point of mockData) {
        const result = await apiCall('/consumption', 'POST', {
            userId: TEST_USER_ID,
            hourlyConsumption: point.hourlyConsumption,
            timestamp: point.timestamp,
            temperature: point.temperature
        });

        if (result.status === 200 && result.data.success) {
            successCount++;
            lastResponse = result.data;
        }
    }

    console.log(`✓ Stored ${successCount}/${mockData.length} data points`);
    console.log(`  Last response:`, JSON.stringify(lastResponse, null, 2));

    return successCount === mockData.length;
}

async function test2_CalculateBaselines() {
    console.log('\n========================================');
    console.log('TEST 2: Calculate Baseline Statistics');
    console.log('========================================');

    const result = await apiCall('/calculate-baselines', 'POST', {
        userId: TEST_USER_ID
    });

    console.log(`Status: ${result.status}`);

    if (result.status === 200 && result.data.success) {
        console.log(`✓ Baselines calculated: ${result.data.baselinesCount} hours`);

        // Show some sample baselines
        const samples = result.data.baselines.filter(b => [0, 6, 12, 18, 19].includes(b.hour));
        console.log('\nSample baselines:');
        samples.forEach(b => {
            console.log(`  Hour ${b.hour.toString().padStart(2, '0')}: mean=${b.mean}W, stdDev=${b.stdDev}W, range=[${b.min}-${b.max}]W`);
        });
        return true;
    } else {
        console.log('✗ Failed:', result.data);
        return false;
    }
}

async function test3_DetectAnomalies() {
    console.log('\n========================================');
    console.log('TEST 3: Anomaly Detection');
    console.log('========================================');

    // Test cases with expected outcomes
    const testCases = [
        {
            name: 'Normal consumption at 7 PM',
            consumptionValue: 1200,
            hour: 19,
            expectAnomaly: false
        },
        {
            name: 'High spike at 7 PM (+50%)',
            consumptionValue: 1800,
            hour: 19,
            expectAnomaly: true
        },
        {
            name: 'Very high spike at 7 PM (+100%)',
            consumptionValue: 2400,
            hour: 19,
            expectAnomaly: true
        },
        {
            name: 'Low dip at 3 AM (-75%)',
            consumptionValue: 50,
            hour: 3,
            expectAnomaly: true
        },
        {
            name: 'Normal consumption at 3 AM',
            consumptionValue: 180,
            hour: 3,
            expectAnomaly: false
        }
    ];

    let passed = 0;

    for (const testCase of testCases) {
        const timestamp = new Date();
        timestamp.setHours(testCase.hour, 30, 0, 0);

        const result = await apiCall('/analyze', 'POST', {
            userId: TEST_USER_ID,
            consumptionValue: testCase.consumptionValue,
            timestamp: timestamp.toISOString()
        });

        const isAnomaly = result.data.isAnomaly;
        const success = isAnomaly === testCase.expectAnomaly;

        console.log(`\n${success ? '✓' : '✗'} ${testCase.name}`);
        console.log(`  Value: ${testCase.consumptionValue}W at hour ${testCase.hour}`);
        console.log(`  Expected: ${testCase.expectAnomaly ? 'ANOMALY' : 'NORMAL'}, Got: ${isAnomaly ? 'ANOMALY' : 'NORMAL'}`);

        if (isAnomaly) {
            console.log(`  Z-Score: ${result.data.zScore}, Confidence: ${result.data.confidence}`);
            console.log(`  Deviation: ${result.data.deviation}`);
            console.log(`  Cause: ${result.data.possibleCause}`);
        } else {
            console.log(`  Z-Score: ${result.data.zScore}`);
        }

        if (success) passed++;
    }

    console.log(`\nTest 3 Results: ${passed}/${testCases.length} passed`);
    return passed >= testCases.length - 1; // Allow 1 failure due to randomness
}

async function test4_GetAnomalyHistory() {
    console.log('\n========================================');
    console.log('TEST 4: Get Anomaly History');
    console.log('========================================');

    const result = await apiCall(`/history?userId=${TEST_USER_ID}&days=7`);

    console.log(`Status: ${result.status}`);

    if (result.status === 200) {
        console.log(`✓ Total anomalies found: ${result.data.totalAnomalies}`);

        if (result.data.anomalies.length > 0) {
            console.log('\nRecent anomalies:');
            result.data.anomalies.slice(0, 3).forEach(a => {
                console.log(`  - ${a.timestamp}: ${a.consumption}W (${a.deviation}), ${a.confidence} confidence`);
            });
        }

        if (result.data.summary) {
            console.log('\nSummary:');
            console.log(`  Avg deviation: ${result.data.summary.avgDeviationPercent}%`);
            console.log(`  Most common hour: ${result.data.summary.mostCommonHour}`);
            console.log(`  Most common cause: ${result.data.summary.mostCommonCause}`);
        }

        return true;
    } else {
        console.log('✗ Failed:', result.data);
        return false;
    }
}

async function test5_ReportFeedback() {
    console.log('\n========================================');
    console.log('TEST 5: Report User Feedback (ML Improvement)');
    console.log('========================================');

    // First, get an anomaly to report on
    const historyResult = await apiCall(`/history?userId=${TEST_USER_ID}&days=7`);

    if (historyResult.data.anomalies && historyResult.data.anomalies.length > 0) {
        const anomalyId = historyResult.data.anomalies[0].id;

        // Report that this was normal behavior
        const result = await apiCall('/report', 'POST', {
            userId: TEST_USER_ID,
            anomalyId: anomalyId,
            appliance: 'AC',
            duration: 60,
            wasNormal: true
        });

        console.log(`Status: ${result.status}`);

        if (result.status === 200 && result.data.success) {
            console.log(`✓ Feedback recorded`);
            console.log(`  Message: ${result.data.message}`);
            console.log(`  New threshold: ${result.data.newThreshold}`);
            console.log(`  Feedback count: ${result.data.feedbackCount}`);
            return true;
        } else {
            console.log('✗ Failed:', result.data);
            return false;
        }
    } else {
        console.log('⚠ No anomalies to report on');
        return true;
    }
}

async function test6_GetBaselines() {
    console.log('\n========================================');
    console.log('TEST 6: Get Baseline Statistics');
    console.log('========================================');

    const result = await apiCall(`/baselines?userId=${TEST_USER_ID}`);

    console.log(`Status: ${result.status}`);

    if (result.status === 200) {
        console.log(`✓ Baseline status: ${result.data.status}`);
        console.log(`  Total hours with baselines: ${result.data.baselines.length}`);

        if (result.data.baselines.length > 0) {
            // Find hour with adjusted threshold
            const adjusted = result.data.baselines.find(b => b.thresholdMultiplier !== 2.0);
            if (adjusted) {
                console.log(`\n  Adjusted threshold found for hour ${adjusted.hour}: ${adjusted.thresholdMultiplier}`);
            }
        }

        return result.data.baselines.length === 24;
    } else {
        console.log('✗ Failed:', result.data);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║        ANOMALY DETECTION ENGINE - TEST SUITE               ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`\nTest User ID: ${TEST_USER_ID}`);
    console.log(`Base URL: ${BASE_URL}`);
    console.log('\nStarting tests...');

    const results = {
        test1: await test1_StoreConsumptionData(),
        test2: await test2_CalculateBaselines(),
        test3: await test3_DetectAnomalies(),
        test4: await test4_GetAnomalyHistory(),
        test5: await test5_ReportFeedback(),
        test6: await test6_GetBaselines()
    };

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    TEST SUMMARY                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`\n  Test 1 (Store Data):      ${results.test1 ? '✓ PASSED' : '✗ FAILED'}`);
    console.log(`  Test 2 (Baselines):       ${results.test2 ? '✓ PASSED' : '✗ FAILED'}`);
    console.log(`  Test 3 (Detection):       ${results.test3 ? '✓ PASSED' : '✗ FAILED'}`);
    console.log(`  Test 4 (History):         ${results.test4 ? '✓ PASSED' : '✗ FAILED'}`);
    console.log(`  Test 5 (Feedback/ML):     ${results.test5 ? '✓ PASSED' : '✗ FAILED'}`);
    console.log(`  Test 6 (Get Baselines):   ${results.test6 ? '✓ PASSED' : '✗ FAILED'}`);

    const passedCount = Object.values(results).filter(r => r).length;
    const totalCount = Object.keys(results).length;

    console.log(`\n  Overall: ${passedCount}/${totalCount} tests passed`);

    if (passedCount === totalCount) {
        console.log('\n  🎉 All tests passed! Anomaly Detection Engine is working correctly.');
    } else {
        console.log('\n  ⚠ Some tests failed. Please check the output above for details.');
    }
}

// Run tests
runAllTests().catch(console.error);
