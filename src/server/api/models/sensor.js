const mongoose = require('mongoose');

module.exports = {
  sensor: new mongoose.Schema({
    label: String,
    type: String,
    unit: String,
    data: [{ type: mongoose.Schema.ObjectId, ref: 'SensorData' }]
  }),
  sensorData: new mongoose.Schema({
    value: Number,
    time: { type: Date, default: Date.now }
  })
}