const EnergyData = require('../models/EnergyData');
const User = require('../models/User');

exports.postData = async (req, res) => {
  const { voltage, current, power, energy } = req.body;

  try {
    const newEnergyData = new EnergyData({
      device: req.user.id,
      voltage,
      current,
      power,
      energy,
    });

    const energyData = await newEnergyData.save();
    res.json(energyData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getLatestData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const latestData = await EnergyData.findOne({ device: req.user.id })
                                        .sort({ timestamp: -1 });

    if (!latestData) return res.status(404).json({ msg: 'No data found for this device' });

    res.json(latestData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getLiveSensorData = async (req, res) => {
  try {
    const latestData = await EnergyData.findOne({ device: req.user.id })
                                        .sort({ timestamp: -1 });

    if (!latestData) {
      // If no real data, provide mock data for demonstration
      return res.json({
        voltage: 230 + Math.random() * 10 - 5, // Simulate minor fluctuations
        current: 5.2 + Math.random() * 0.5 - 0.25,
        power: 1200 + Math.random() * 100 - 50,
        energy: 3.5 + Math.random() * 0.1 - 0.05,
        timestamp: new Date().toISOString()
      });
    }

    res.json(latestData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getHistoryData = async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const historyData = await EnergyData.find({
      device: req.user.id,
      timestamp: { $gte: twentyFourHoursAgo }
    }).sort({ timestamp: 1 });

    res.json(historyData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};