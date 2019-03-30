const mongoose = require('mongoose');

const models = {
  nodeSchema: new mongoose.Schema({
    label: String,
    live_since: { type: Date, default: Date.now },
    identity: String,
    sensors: [{ type: mongoose.Schema.ObjectId, ref: 'Sensor' }],
    //plants: [{ type: mongoose.Schema.ObjectId, ref: 'Plant' }]
  }),
  sensorSchema: new mongoose.Schema({
    label: String,
    type: String,
    unit: String,
    data: [{ type: mongoose.Schema.ObjectId, ref: 'SensorData' }]
  }),
  sensorDataSchema: new mongoose.Schema({
    value: Number,
    time: { type: Date, default: Date.now }
  }),
  plantSchema: new mongoose.Schema({
    type: String,
    planted: { type: Date, default: Date.now }
  })
}

module.exports = models;