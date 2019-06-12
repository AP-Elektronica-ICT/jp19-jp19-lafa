const mongoose = require('mongoose');

module.exports = {
  user: new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    username: String,
    accessToken: String,
    msuid: String,
    nodes: [{ type: mongoose.Schema.ObjectId, ref: 'Node' }]
  })
}