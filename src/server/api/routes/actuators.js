const router = require('express').Router({ mergeParams: true });
const nodeSchema = require('../models/node').node;
const actuatorSchema = require('../models/actuator').actuator;

module.exports = (db, logger, mqtt) => {
  const Node = db.model('Node', nodeSchema);
  const Actuator = db.model('Actuator', actuatorSchema);

  /**
   * Get actuator state
   * @param {ObjectId} actuatorid
   * @returns {ActuatorObject}
   */
  router.get('/:actuatorid/', (req, res) => {
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
  router.put('/:actuatorid/:value', (req, res) => {
    Node.findOne({ "actuators": { "$all": req.params.actuatorid } })
      .select('_id mac_address')
      .exec((err, node) => {
        Actuator.findByIdAndUpdate(req.params.actuatorid, { value: req.params.value }, (err, actuator) => {
          mqtt.publish({
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

  return router;
}