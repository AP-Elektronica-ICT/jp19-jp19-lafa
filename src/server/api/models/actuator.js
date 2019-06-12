const mongoose = require('mongoose');

module.exports = {
  actuator: new mongoose.Schema({
    label: String,
    type: String,
    value: String
  })
}