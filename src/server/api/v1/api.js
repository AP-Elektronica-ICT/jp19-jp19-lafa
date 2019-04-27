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
        payload: id,
        qos: 1
      });
    }
  };

  /**
   * Create MQTT Server
   */
  const server = new mosca.Server({
    port: 1883,
    backend: {
      type: 'mongo',
      url: 'mongodb://database:27017/mqtt',
      pubsubCollection: 'ascoltatori',
      mongo: {}
    }
  });

  /**
   * MQTT Server on Ready
   */
  server.on('ready', () => {
    console.log('MQTT Server Running');
    server.authenticate = authenticate;
  });

  /**
   * MQTT Server on Subscribe (Client)
   */
  server.on('subscribed', (topic, client) => {
    switch (topic) {
      case id:
        const node = generateNewNode();
        mqtt.send(topic, node.id);
        console.log('New Node: ' + node.id);
        break;
    }
  });

  /**
   * Generate new node
   */
  function generateNewNode() {
    // Actuators
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
    const foodpumpAct = new Actuator({
      label: 'Food Pump',
      type: 'foodpump',
      value: '0'
    });
    foodpumpAct.save();
    // Sensors
    const airtempSen = new Sensor({
      label: 'Air Temperature',
      type: 'airtemp',
      unit: '&deg;C'
    });
    airtempSen.save();
    const watertempSen = new Sensor({
      label: 'Water Temperature',
      type: 'watertemp',
      unit: '&deg;C'
    });
    watertempSen.save();
    const lightstrSen = new Sensor({
      label: 'Light Strength',
      type: 'lightstr',
      unit: '&amp;'
    });
    lightstrSen.save();
    const airhumiditySen = new Sensor({
      label: 'Air Humidity',
      type: 'airhumidity',
      unit: '&amp;'
    });
    airhumiditySen.save();
    const waterphSen = new Sensor({
      label: 'Water Hardness',
      type: 'waterph',
      unit: '&amp;'
    });
    waterphSen.save();
    // Node
    const node = new Node({
      label: 'Development Node',
      identity: 'DevTemp',
      status: 0,
      actuators: [
        lightintAct.id,
        flowpumpAct.id,
        foodpumpAct.id
      ],
      sensors: [
        airtempSen.id,
        watertempSen.id,
        lightstrSen.id,
        airhumiditySen.id,
        waterphSen.id,
      ]
    });
    node.save();
    return node;
  }

  /**
   * MQTT Server on Publish (Any)
   */
  server.on('published', (packet, client) => {
    const topic = serializeTopic(packet);
    if(topic)
      console.log(topic);
  });

  /**
   * Serialize and validate a received MQTT Packet
   * @param {MQTTPacket} packet MQTT Packet
   * @returns {Array(Topic.split)}
   */
  function serializeTopic(packet) {
    topics = [
      'lightstr',
      'watertemp',
      'airtemp',
      'airhumidity',
      'waterph',
      'lightint',
      'flowpump',
      'foodpump'
    ];
    const topic = packet.topic.split('/');
    if(topic[0] != '$SYS') {
      if (topics.includes(topic[1])) {
        return topic;
      }
    } else
      return false;
  }

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