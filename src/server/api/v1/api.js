const router = require('express').Router({ mergeParams: true });
const schemas = require('./schemas');
const mosca = require('mosca');

module.exports = function (db, logger) {

  // Mongoose Schemas
  const Node = db.model('Node', schemas.nodeSchema);
  const Sensor = db.model('Sensor', schemas.sensorSchema);
  const SensorData = db.model('SensorData', schemas.sensorDataSchema);
  const Actuator = db.model('Actuator', schemas.actuatorSchema);

  /*/// MQTT ///*/

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

  function isRootClient(client) {
    if(client.id.match(/^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/)){
      return true;
    }
    return false;
  }

  /**
   * MQTT Authentication
   */
  server.authenticate = (client, username, password, callback) => {
    if(client && username && password) {
      if(client.id.match(/^([0-9A-Fa-f]{2}[:]){5,6}([0-9A-Fa-f]{2})$/))
        if(username.toString() === 'Farm' && password.toString() === 'Lab') {
          callback(null, true);
          return;
        } else {
          logger.warn(`Client ${client.id} tried to connect with invalid credentials`);
        }
      else
        logger.warn(`Client ${client.id} tried to connect with an invalid ID`);
    } else {
      logger.warn(`Client ${client.id} tried to connect with an invalid ID`);
    }
    callback(null, false);
  }

  /**
   * MQTT Server Ready
   */
  server.on('ready', () => {
    logger.info('MQTT Server Running on port 1883');
  });

  /**
   * MQTT Server Message Publish
   */
  server.on('published', (packet, client) => {
    logger.info(`MQTT Message ${ packet.payload } by client ${ client.id } on topic ${ packet.topic }`);
  });

  /**
   * MQTT Client connected to Server
   */
  server.on('clientConnected', function (client) {
    if(isRootClient(client)) {
      logger.info(`Client ${client.id} connected (ROOT)`);
    } else {
      logger.info(`Client ${client.id} connected (NON ROOT)`);
    }
    if(isRootClient(client)) {
      Node.findOne({ "mac_address": client.id })
      .select('_id')
      .exec((err, node) => {
        if (node) {
          logger.info(`Client ${client.id} has existing node ${node.id}`);
          Node.findOneAndUpdate({ mac_address: client.id }, { status: 1 }, (err, node) => {
            logger.info(`Client ${node.mac_address} set status to online`);
          });
        } else {
          logger.warn(`Client ${client.id} doesn't have a node`);
          require('./firstconnect')(db, logger, client.id);
        }
      });
    }
  });

  /**
   * MQTT Client disconnect from Server
   */
  server.on('clientDisconnected', function(client) {
    if(isRootClient(client)) {
      logger.info(`Client ${client.id} disconnected (ROOT)`);
    } else {
      logger.info(`Client ${client.id} disconnected (NON ROOT)`);
    }
    if (isRootClient(client)) {
      Node.findOneAndUpdate({ mac_address: client.id }, { status: 0 }, (err, node) => {
        logger.info(`Client ${node.mac_address} set status to offline`);
      });
    }
  });

  /*/// ROUTES ///*/

  /*/ GET /*/
  /**
   * Get all nodes
   * @returns {Node[]}
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
      .select('_id mac_address')
      .exec((err, node) => {
        Actuator.findByIdAndUpdate(req.params.actuatorid, { value: req.params.value }, (err, actuator) => {
          server.publish({
            topic: node.mac_address + '/actuator/' + actuator.type,
            payload: req.params.value,
            qos: 1
          });
          logger.info(`Published update to topic ${node.mac_address + '/actuator/' + actuator.type}`);
          actuator.value = req.params.value;
          logger.info(`Updated actuator ${actuator.id} to ${req.params.value}`);
          res.statusCode = 202;
          res.send(actuator);
        });
      });
  });

  router.get('*', (req, res) => {
    res.sendStatus(404);
  });

  return router;
}
