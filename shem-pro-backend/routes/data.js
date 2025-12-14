const express = require('express');
const router = express.Router();
const { getLatestData, postData, getLiveSensorData, getHistoryData } = require('../controllers/data');
const auth = require('../middleware/auth');

// @route   POST /api/data
// @desc    Save energy data
// @access  Private
router.post('/', auth, postData);

// @route   GET /api/data/latest
// @desc    Get latest energy data for logged in user
// @access  Private
router.get('/latest', auth, async (req, res) => {
  try {
    if (req.user.id === 'demo-user') {
      return res.json({
        voltage: 230,
        current: 5.2,
        power: 1200,
        energy: 3.5,
        timestamp: new Date().toISOString()
      });
    }
    // If not a demo user, proceed with the actual getLatestData logic
    await getLatestData(req, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/data/live
// @desc    Get live sensor data for logged in user
// @access  Private
router.get('/live', auth, getLiveSensorData);

// @route   GET /api/data/history
// @desc    Get 24-hour historical power usage for logged in user
// @access  Private
router.get('/history', auth, getHistoryData);

module.exports = router;