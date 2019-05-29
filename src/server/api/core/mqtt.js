
/*/// MQTT ///*/

const mosca = require('mosca');
const nodeSchema = require('../models/node').node;
const sensorSchema = require('../models/sensor').sensor;
const sensorDataSchema = require('../models/sensor').sensorData;
const mongoose = require('mongoose');

module.exports = (db, logger) => {
  const Node = db.model('Node', nodeSchema);
  const Sensor = db.model('Sensor', sensorSchema);
  const SensorData = db.model('SensorData', sensorDataSchema);

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
    return client.id.match(/^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/);
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
    logger.info('MQTT Server Running');
  });

  /**
   * MQTT Server Message Publish
   */
  server.on('published', (packet, client) => {
    if(packet.topic.split('/')[0].match(/^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/))
      if (packet.topic.split('/')[1] === 'sensors') handleSensor(packet, client);
  });

  /**
   * MQTT Client connected to Server
   */
  server.on('clientConnected', function (client) {
    if(isRootClient(client)) {
      logger.info(`Client ${client.id} connected (ROOT)`);
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
          require('./generate')(db, logger, client.id);
        }
      });
    } else {
      logger.info(`Client ${client.id} connected (NON ROOT)`);
    }
  });

  /**
   * MQTT Client disconnect from Server
   */
  server.on('clientDisconnected', function(client) {
    if(isRootClient(client)) {
      logger.info(`Client ${client.id} disconnected (ROOT)`);
      Node.findOneAndUpdate({ mac_address: client.id }, { status: 0 }, (err, node) => {
        logger.info(`Client ${node.mac_address} set status to offline`);
      });
    } else {
      logger.info(`Client ${client.id} disconnected (NON ROOT)`);
    }
  });

  function handleSensor(packet, client) {
    getSensorIdByNodeId(packet.topic.split('/')[2], client).then(id => {
      Sensor.findById(id).exec((err, doc) => {
        senData = new SensorData({
          value: packet.payload.toString()
        })
        senData.save();
        doc.data.push(senData.id);
        doc.save();
        logger.info(`MQTT Sensor Message ${ packet.payload.toString() } by client ${ client.id } on sensor ${ packet.topic.split('/')[2] }`);
      });
    }).catch(err => {
      logger.warn(`Invalid Sensor topic ${ packet.topic}`);
    });
  }

  function getSensorIdByNodeId(type, client) {
    return new Promise((resolve, reject) => {
      if(!isRootClient(client)) nodeClient = client.id.substring(0, 17);
      else nodeClient = client.id;
      Node.findOne({ "mac_address": nodeClient })
      .select('sensors')
      .populate({ path: 'sensors', select: '_id type'})
      .exec((err, node) => {
        // TODO: Find a better solution
        node.sensors.forEach(sensor => {
          if (sensor.type == type) resolve(sensor._id);
        });
        reject(null);
      })
    });
  }

  return server;
}