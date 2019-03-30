const router = require('express').Router({ mergeParams: true });
const models = require('./models');

module.exports = function (app, db) {

  const Node = db.model('Node', models.nodeSchema);
  const Sensor = db.model('Sensor', models.sensorSchema)
  const SensorData = db.model('SensorData', models.sensorDataSchema)

  // Get all nodes
  router.get('/nodes', (req, res) => {
    Node.find({})
      .select('-sensors -__v')
      .exec((err, docs) => {
        res.send(docs);
      });
  });

  // Get Data from a specific Node
  router.get('/nodes/:nodeid', (req, res) => {
    Node.findById(req.params.nodeid)
      .select('-__v')
      .populate({ path: 'sensors', select: '-data -__v' })
      .exec((err, docs) => {
        res.send(docs);
      });
  });

  // Get all sensors in a specific node
  router.get('/nodes/:nodeid/sensors', (req, res) => {
    Node.findById(req.params.nodeid).select('sensors -_id')
      .populate({ path: 'sensors', select: '-data -__v' })
      .exec((err, docs) => {
        res.send(docs.sensors);
      });
  });

  // Get sensor data from a specific sensor in a specific node
  router.get('/sensors/:sensorid/:amount?', (req, res) => {
    if (!req.params.amount) req.params.amount = 1
    if(req.params.amount > 15) req.params.amount = 15
    Sensor.findById(req.params.sensorid)
      .select('-__v -_id')
      .populate({ path: 'data', select: '-__v -_id', options: { limit: req.params.amount } })
      .exec((err, docs) => {
        res.send(docs)
      });
  });

  router.get('*', (req, res) => {
    res.sendStatus(404);
  });

  return router;
};