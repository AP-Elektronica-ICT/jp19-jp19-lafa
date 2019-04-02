const router = require('express').Router({ mergeParams: true });
const schemas = require('./schemas');
const mosca = require('mosca');

// TODO: Break up routes into files
// TODO: Clean up MQTT server

module.exports = function (db) {

  const Node = db.model('Node', schemas.nodeSchema);
  const Sensor = db.model('Sensor', schemas.sensorSchema);
  const SensorData = db.model('SensorData', schemas.sensorDataSchema);
  const Actuator = db.model('Actuator', schemas.actuatorSchema);

  /*/// MQTT ~ Mosca ///*/

  const authenticate = (client, username, password, callback) => {
    const authorized = (username === 'demo' && password.toString() === 'demopass');
    if (authorized) client.user = username;
    callback(null, authorized);
  };

  const mqtt = {
    send: (topic, id) => {
      server.publish({
        topic: topic,
        payload: id
      });
    }
  }

  const server = new mosca.Server({
    port: 1883,
    backend: {
      type: 'mongo',
      url: 'mongodb://database:27017/mqtt',
      pubsubCollection: 'ascoltatori',
      mongo: {}
    }
  });

  server.on('ready', () => {
    console.log('MQTT Server Running');
    server.authenticate = authenticate;
  });

  // TODO: Automatic sensor & actuator creation
  server.on('subscribed', (topic, client) => {
    if (topic == 'id') {
      const lightintAct = new Actuator({
        label: 'Light Strip',
        type: 'lightint',
        value: '0'
      });
      lightintAct.save();
      const flowpumpAct = new Actuator({
        label: 'Flow Pump',
        type: 'flowpump',
        value: '0'
      });
      flowpumpAct.save();
      const watertempSen = new Sensor({
        label: 'Water Temperature',
        type: 'watertemp',
        unit: '&deg;C'
      });
      watertempSen.save();
      const node = new Node({
        label: 'Development Node',
        identity: 'DevTemp',
        status: 0,
        actuators: [
          lightintAct.id,
          flowpumpAct.id
        ],
        sensors: [
          watertempSen.id
        ]
      });
      node.save();
      mqtt.send(topic, node.id);
      console.log('New Node: ' + node.id);
    }
  });

  // TODO: Add sensor updates & make dynamic
  server.on('published', (packet, client) => {
    // const topic = packet.topic.split('/');
    // if (topic[0] != '$SYS')
    //   if (topic[1] == 'light')
    //     console.log('Light Strength: ' + packet.payload.toString());
    //   else if (topic[1] == 'watertemp')
    //     console.log('Air Temp: ' + packet.payload.toString());
    //   else if (topic[1] == 'temp')
    //     console.log('Water Temp: ' + packet.payload.toString());
    //   else
    //     console.log('Random');
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
      .exec((err, nodes) => {
        res.send(nodes);
      });
  });

  /**
   * Get all data from a node
   * @param {ObjectId} nodeid
   * @returns {Node}
   */
  router.route('/nodes/:nodeid').get((req, res) => {
    Node.findById(req.params.nodeid)
      .select('-__v')
      .populate({ path: 'sensors', select: '-data -__v' })
      .populate({ path: 'actuators', select: '-__v' })
      .exec((err, node) => {
        res.send(node);
      });
  });

  /**
   * Get all the latest sensor data
   * @param {ObjectId} nodeid
   * @returns {Node}
   */
  router.route('/nodes/:nodeid/latest').get((req, res) => {
    Node.findById(req.params.nodeid)
      .select('-__v')
      .populate({
        path: 'sensors',
        select: '-__v',
        populate: {
          path: 'data',
          select: '-__v -_id',
          options: {
            limit: '1',
            sort: { time: -1 }
          }
        }
      })
      .populate({ path: 'actuators', select: '-__v' })
      .exec((err, node) => {
        res.send(node);
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
      .exec((err, sensor) => {
        res.send(sensor)
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
      .exec((err, actuator) => {
        res.send(actuator)
      });
  });

  /**
   * Update actuator state
   * @param {ObjectId} actuatorid
   * @param {number} value (0-255)
   * @returns {ActuatorObject}
   */
  // TODO: Add validation
  router.put('/actuators/:actuatorid/:value', (req, res) => {
    Node.findOne({ "actuators": { "$all": req.params.actuatorid } })
      .select('_id')
      .exec((err, node) => {
        Actuator.findByIdAndUpdate(req.params.actuatorid, { value: req.params.value }, (err, actuator) => {
          mqtt.send(node._id + '/actuator/' + actuator.type, req.params.value);
          actuator.value = req.params.value;
          res.statusCode = 202;
          res.send(actuator);
        });
      });
  });

  router.get('*', (req, res) => {
    res.sendStatus(404);
  });

  return router;

};