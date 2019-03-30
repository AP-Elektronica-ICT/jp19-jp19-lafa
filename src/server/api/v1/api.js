const router = require('express').Router({ mergeParams: true });
const models = require('./models');

module.exports = function (app, db) {

  const Node = db.model('Node', models.nodeSchema);

  // Get all nodes
  router.get('/nodes', (req, res) => {
    Node.find({}).exec((err, docs) => {
      res.send(docs);
    });
  });

  // router.get('/nodes/post', (req, res) => {
  //   const node = new Node({
  //     label: 'Node One',
  //     identity: 'Timothy'
  //   })
  //   node.save().then(() => console.log('Saved Node'));
  //   res.send('Created Node');
  // });

  // Get all sensors in a specific node
  router.get('/nodes/:nodeid/sensors', (req, res) => {
    res.send(req.params.nodeid + ' sensors');
  });

  // Get sensor data from a specific sensor in a specific node
  router.get('/nodes/:nodeid/sensors/:sensorid/:amount?', (req, res) => {
    if (!req.params.amount) req.params.amount = 1
    res.send(req.params.nodeid + ' sensor ' + req.params.sensorid + ' amount ' + req.params.amount);
  });

  router.get('*', (req, res) => {
    res.sendStatus(404);
  });

  return router;
};