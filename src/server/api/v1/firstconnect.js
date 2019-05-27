const schemas = require('./schemas');

module.exports = function (db, logger, mac_address) {
  // Mongoose Schemas
  const Node = db.model('Node', schemas.nodeSchema);
  const Sensor = db.model('Sensor', schemas.sensorSchema);
  const SensorData = db.model('SensorData', schemas.sensorDataSchema);
  const Actuator = db.model('Actuator', schemas.actuatorSchema);

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
    label: 'Node ' + mac_address,
    identity: undefined,
    mac_address: mac_address,
    status: 1,
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
  logger.warn(`Created node ${node.id} with mac_address ${mac_address}`);
  return node;
}