const router = require('express').Router({ mergeParams: true });
const schemas = require('./schemas');

module.exports = function (db) {

  const Node = db.model('Node', schemas.nodeSchema);
  const Sensor = db.model('Sensor', schemas.sensorSchema);
  const SensorData = db.model('SensorData', schemas.sensorDataSchema);
  const Actuator = db.model('Actuator', schemas.actuatorSchema);

  router.post('/node', (req, res) => {
    const node = new Node({
      label: req.body.label,
      identity: req.body.identity,
      status: req.body.status
    });
    node.save();
    res.statusCode = 201;
    res.send(node);
  });

  router.post('/sensor', (req, res) => {
    const sensor = new Sensor({
      label: req.body.label,
      type: req.body.type,
      unit: req.body.unit
    }).save();
    Node.findById(req.body.parent).exec((err, docs) => {
      docs.sensors.push(sensor.id)
      docs.save(() => {
        res.sendStatus(201);
      });
    });
  });

  router.post('/sensordata', (req, res) => {
    const sensorData = new SensorData({
      value: req.body.value
    }).save();
    Sensor.findById(req.body.parent).exec((err, docs) => {
      docs.data.push(sensorData.id);
      docs.save(() => {
        res.sendStatus(201);
      });
    });
  });

  router.post('/actuator', (req, res) => {
    const actuator = new Actuator({
      label: req.body.label,
      type: req.body.type,
      value: req.body.value
    }).save();
    Node.findById(req.body.parent).exec((err, docs) => {
      docs.actuators.push(actuator.id);
      docs.save(() => {
        res.sendStatus(201);
      });
    });
  });

  return router;

}