var mosca = require('mosca');

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://database:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var settings = {
  port: 1883,
  backend: ascoltatore
};

var server = new mosca.Server(settings);

server.on('subscribed', (topic, client) => {
  if (topic == 'id') {
    send(topic, client.id);
  } else if (topic == "light") {
    const rand = Math.floor(Math.random() * 255);
    send(topic, rand.toString(10));
  }
  console.log(topic);
});

server.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', (packet, client) => {

  console.log('Published', packet.payload.toString('utf8'));
});

server.on('ready', () => {
  console.log('Mosca server is up and running');
  server.authenticate = authenticate;
});

// Accepts the connection if the username and password are valid
var authenticate = (client, username, password, callback) => {
  var authorized = (username === 'demo' && password.toString() === 'demopass');
  if (authorized) client.user = username;
  callback(null, authorized);
}

// // In this case the client authorized as alice can publish to /users/alice taking
// // the username from the topic and verifing it is the same of the authorized user
// var authorizePublish = (client, topic, payload, callback) => {
//   callback(null, client.user == topic.split('/')[1]);
// }

// // In this case the client authorized as alice can subscribe to /users/alice taking
// // the username from the topic and verifing it is the same of the authorized user
// var authorizeSubscribe = (client, topic, callback) => {
//   callback(null, client.user == topic.split('/')[1]);
// }

function send(topic, id) {
  var message = {
    topic: topic,
    payload: id, // or a Buffer
  };
  console.log(message);
  server.publish(message, function () {
    console.log('done!');
  });
}