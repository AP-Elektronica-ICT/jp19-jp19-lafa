const router = require('express').Router({ mergeParams: true });
const models = require('./models');

module.exports = function (app, db) {

  const Node = db.model('Node', models.nodeSchema);
  const Sensor = db.model('Sensor', models.sensorSchema)

  // Get all nodes
  router.get('/nodes', (req, res) => {
    Node.find({}).select('-sensors -__v').exec((err, docs) => {
      res.send(docs);
    });
  });

  // Get Data from a specific Node
  router.get('/nodes/:nodeid', (req, res) => {
    Node.findById(req.params.nodeid).select('-__v').populate({ path: 'sensors', select: '-data -__v' }).exec((err, docs) => {
      res.send(docs);
    });
  });

  // Get all sensors in a specific node
  router.get('/nodes/:nodeid/sensors', (req, res) => {
    Node.findById(req.params.nodeid).select('sensors -_id').populate({ path: 'sensors', select: '-data -__v' }).exec((err, docs) => {
      res.send(docs.sensors);
    });
  });

  // Get sensor data from a specific sensor in a specific node
  router.get('/nodes/:nodeid/sensors/:sensorid/:amount?', (req, res) => {
    if (!req.params.amount) req.params.amount = 1
    res.send(req.params.nodeid + ' sensor ' + req.params.sensorid + ' amount ' + req.params.amount);
  });

  // router.get('/populate/nodes', (req, res) => {
  //   const node = new Node({
  //     label: 'Node One',
  //     identity: 'Timothy'
  //   })
  //   node.save().then(() => console.log('Saved Node'));
  //   res.send('Created Node');
  // });

  // router.get('/populate/sensors/:nodeid', (req, res) => {
  //   const sensor = new Sensor({
  //     label: 'Air Temperature',
  //     type: 'Temperature',
  //     unit: 'deg Celcius'
  //   })
  //   sensor.save();
  //   Node.findById(req.params.nodeid).exec((err, docs) => {
  //     docs.sensors.push(sensor.id)
  //     docs.save(res.send('Created and added Sensor'))
  //   });
  // });

  router.get('*', (req, res) => {
    res.sendStatus(404);
  });

  return router;
};