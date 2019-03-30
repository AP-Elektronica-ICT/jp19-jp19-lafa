// This document is for dev perposes only
const router = require('express').Router({ mergeParams: true });
const models = require('./models');

module.exports = function (app, db) {

  const Node = db.model('Node', models.nodeSchema);
  const Sensor = db.model('Sensor', models.sensorSchema)
  const SensorData = db.model('SensorData', models.sensorDataSchema)

  router.get('/pp/nodes', (req, res) => {
    const node = new Node({
      label: 'Node One',
      identity: 'Timothy'
    })
    node.save().then(() => console.log('Saved Node'));
    res.send('Created Node');
  });

  router.get('/pp/sensors/:nodeid', (req, res) => {
    const sensor = new Sensor({
      label: 'Air Temperature',
      type: 'Temperature',
      unit: 'deg Celcius'
    })
    sensor.save();
    Node.findById(req.params.nodeid).exec((err, docs) => {
      docs.sensors.push(sensor.id)
      docs.save(res.send('Created and added Sensor'))
    });
  });

  router.get('/pp/sensors/:sensorid', (req, res) => {
    const sensorData = new SensorData({
      value: Math.floor(Math.random()*(30-12+1)+12)
    });
    sensorData.save();
    Sensor.findById(req.params.sensorid).exec((err, docs) => {
      docs.data.push(sensorData.id)
      docs.save(res.send('Added Sensor Data'))
    });
  });

  return null;
};