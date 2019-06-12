const mongoose = require('mongoose');

module.exports = {
  node: new mongoose.Schema({
    label: String,
    controller_id: String,
    mac_address: String,
    live_since: { type: Date, default: Date.now },
    status: Number,
    sensors: [{ type: mongoose.Schema.ObjectId, ref: 'Sensor' }],
    actuators: [{ type: mongoose.Schema.ObjectId, ref: 'Actuator' }]
  })
}