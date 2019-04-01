const mongoose = require('mongoose');

const schemas = {
  nodeSchema: new mongoose.Schema({
    label: String,
    controller_id: String,
    live_since: { type: Date, default: Date.now },
    identity: String,
    status: Number,
    sensors: [{ type: mongoose.Schema.ObjectId, ref: 'Sensor' }],
    actuators: [{ type: mongoose.Schema.ObjectId, ref: 'Actuator' }]
    //plants: [{ type: mongoose.Schema.ObjectId, ref: 'Plant' }]
  }),
  sensorSchema: new mongoose.Schema({
    label: String,
    type: String,
    unit: String,
    data: [{ type: mongoose.Schema.ObjectId, ref: 'SensorData' }]
  }),
  actuatorSchema:new mongoose.Schema({
    label: String,
    type: String,
    value: String
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

module.exports = schemas;