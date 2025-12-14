const express = require('express');
const router = express.Router();
const esp32DataController = require('../controllers/esp32DataController');

// Route for receiving ESP32C6 sensor data
router.post('/', esp32DataController.receiveData);
router.get('/', esp32DataController.getLatestData);

module.exports = router;