const ESP32Data = require('../models/ESP32Data');

const receiveData = async (req, res) => {
  try {
    const { voltage, current, power, energy_kWh, cost_rs } = req.body;

    // Basic validation
    if (voltage === undefined || current === undefined || power === undefined || energy_kWh === undefined || cost_rs === undefined) {
      return res.status(400).json({ message: 'All sensor data fields are required' });
    }

    const newSensorData = new ESP32Data({
      voltage,
      current,
      power,
      energy_kWh,
      cost_rs,
    });

    await newSensorData.save();

    console.log('Received and saved ESP32C6 sensor data:', newSensorData);

    res.status(200).json({ message: 'Data received and saved successfully' });
  } catch (error) {
    console.error('Error receiving ESP32C6 data:', error);
    res.status(500).json({ message: 'Error receiving data' });
  }
};

const getLatestData = async (req, res) => {
  try {
    const latestData = await ESP32Data.findOne().sort({ timestamp: -1 });

    if (!latestData) {
      return res.status(404).json({ message: 'No sensor data found' });
    }

    res.status(200).json(latestData);
  } catch (error) {
    console.error('Error fetching latest ESP32C6 data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
};

module.exports = { receiveData, getLatestData };