const router = require('express').Router({ mergeParams: true });
const schemas = require('./schemas');
const mosca = require('mosca');

module.exports = function (db, logger) {

  // Mongoose Schemas
  const Node = db.model('Node', schemas.nodeSchema);
  const Sensor = db.model('Sensor', schemas.sensorSchema);
  const SensorData = db.model('SensorData', schemas.sensorDataSchema);
  const Actuator = db.model('Actuator', schemas.actuatorSchema);

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
   * MQTT Authentication
   */
  server.authenticate = (client, username, password, callback) => {
    if(client && username && password) {
      if(client.id.match(/^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/))
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
   * MQTT Client connected to Server
   */
  server.on('clientConnected', function (client) {
    logger.info(`Client ${client.id} connected`);
  });

  /**
   * MQTT Client disconnect from Server
   */
  server.on('clientDisconnected', function(client) {
    logger.info(`Client ${client.id} disconnected`);
  });
  
  return router;
}