const mongoose = require('mongoose');

const ESP32DataSchema = new mongoose.Schema({
  voltage: {
    type: Number,
    required: true,
  },
  current: {
    type: Number,
    required: true,
  },
  power: {
    type: Number,
    required: true,
  },
  energy_kWh: {
    type: Number,
    required: true,
  },
  cost_rs: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ESP32Data', ESP32DataSchema);