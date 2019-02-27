var mosca = require('mosca');

// Sample mqtt server that Matthias needs to extend to the database
// the published callback receives data from a node
// the topic (packet.topic) is the sensor and a packet.payload is a buffer containing information
// the subscribe callback is a request from a node (each node will receive this)
// and the server will need to send the appropriat data. See send function for more info
var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var settings = {
  port: 1884,
  backend: ascoltatore
};

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

server.on('clientDisconnected', function(client) {
    console.log('client Disconnected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  proxy(packet, client);
});

// fired when a client subscribes
server.on('subscribed', function(topic, client) {
    if(topic == 'id'){
        send(topic, client.id);
    }
  });

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}

// Determin what the client requested (or send) and handle it
function proxy(packet, client){
    if(packet.topic == 'node'){
        console.log('Published', packet.payload.toString('utf8'));
    }
}

//sent back info to the client
function send(topic, id){
    var message = {
        topic: topic,
        payload: id, // or a Buffer
      };
      console.log(message);
      server.publish(message, function() {
        console.log('done!');
      });
}