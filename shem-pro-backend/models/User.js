const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  deviceId: { type: String, required: true, unique: true },
  householdSize: { type: Number, required: true },
  houseType: { type: String, required: true },
  energyProvider: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);