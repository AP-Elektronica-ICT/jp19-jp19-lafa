
/*/// MQTT ///*/

const mosca = require('mosca');
const nodeSchema = require('./models/node').node;

module.exports = (db, logger) => {
  const Node = db.model('Node', nodeSchema);

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
      logger.info(`MQTT Message ${ packet.payload } by client ${ client } on topic ${ packet.topic }`);
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
          // TODO: Fix first connect
          //require('./firstconnect')(db, logger, client.id);
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

  return server;
}