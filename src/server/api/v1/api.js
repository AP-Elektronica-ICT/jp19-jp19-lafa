const router = require('express').Router({ mergeParams: true });
const models = require('./models');
const mosca = require('mosca');

module.exports = function (app, db) {

  const Node = db.model('Node', models.nodeSchema);
  const Sensor = db.model('Sensor', models.sensorSchema);
  const SensorData = db.model('SensorData', models.sensorDataSchema);
  const Actuator = db.model('Actuator', models.actuatorSchema);

  /*/// MQTT ~ Mosca ///*/

  const settings = {
    port: 1883,
    backend: {
      type: 'mongo',
      url: 'mongodb://database:27017/mqtt',
      pubsubCollection: 'ascoltatori',
      mongo: {}
    }
  };

  const authenticate = (client, username, password, callback) => {
    const authorized = (username === 'demo' && password.toString() === 'demopass');
    if (authorized) client.user = username;
    callback(null, authorized);
  };

  const send = (topic, id) => {
    server.publish({
      topic: topic,
      payload: id
    });
  };

  const server = new mosca.Server(settings);

  server.on('ready', () => {
    console.log('Mosca server is up and running');
    server.authenticate = authenticate;
  });

  server.on('subscribed', (topic, client) => {
    if (topic == 'id') {
      send(topic, '5ca0da12d903422b03558bbb');
    }
  });

  server.on('published', (packet, client) => {
    const topic = packet.topic.split('/');
    if (topic[0] != '$SYS')
      if (topic[1] == 'light')
        console.log('Light Strength: ' + packet.payload.toString());
      else if (topic[1] == 'watertemp')
        console.log('Air Temp: ' + packet.payload.toString());
      else if (topic[1] == 'temp')
        console.log('Water Temp: ' + packet.payload.toString());
      else
        console.log('Random');
  });

  /*/// ROUTES ///*/
  
  /*/ GET /*/
  /**
   * Get all nodes
   * @returns {Array(Node)}
   */
  router.route('/nodes').get((req, res) => {
    Node.find({})
      .select('-sensors -actuators -__v')
      .exec((err, result) => {
        res.send(result);
      });
  });

  /**
   * Get all data from a node
   * @param {ObjectId} nodeid
   * @returns {Array(Node)}
   */
  router.route('/nodes/:nodeid').get((req, res) => {
    Node.findById(req.params.nodeid)
      .select('-__v')
      .populate({ path: 'sensors', select: '-data -__v' })
      .populate({ path: 'actuators', select: '-__v' })
      .exec((err, docs) => {
        res.send(docs);
      });
  });

  /**
   * Get sensor data
   * @param {ObjectId} sensorid
   * @param {number} limit
   * @returns {SensorObject}
   */
  router.route('/sensors/:sensorid/:limit?').get((req, res) => {
    if (!req.params.limit) req.params.limit = 1;
    Sensor.findById(req.params.sensorid)
      .select('-__v')
      .populate({ path: 'data', select: '-__v -_id', options: { limit: req.params.limit } })
      .exec((err, docs) => {
        res.send(docs)
      });
  });

  /**
   * Get actuator state
   * @param {ObjectId} actuatorid
   * @returns {ActuatorObject}
   */
  router.get('/actuators/:actuatorid/', (req, res) => {
    Actuator.findById(req.params.actuatorid)
      .select('-__v')
      .exec((err, docs) => {
        res.send(docs)
      });
  });

  /**
   * Update actuator state
   * @param {ObjectId} actuatorid
   * @param {number} value (0-255)
   * @returns {ActuatorObject}
   */
  router.put('/actuators/:actuatorid/:value', (req, res) => {
    Actuator.findByIdAndUpdate(req.params.actuatorid, { value: req.params.value }, (err, result) => {
      send('5ca0da12d903422b03558bbb/' +  result.type, req.params.value);
      res.statusCode = 202;
      res.send(result);
    });
  });

  router.get('*', (req, res) => {
    res.sendStatus(404);
  });

  return router;

};