const router = require('express').Router({ mergeParams: true });
const sensorSchema = require('../models/sensor').sensor;

module.exports = (db, logger, mqtt) => {
  const Sensor = db.model('Sensor', sensorSchema);

  /**
   * Get sensor data
   * @param {ObjectId} sensorid
   * @param {number} limit
   * @returns {SensorObject}
   */
  router.route('/:sensorid/:limit?').get((req, res) => {
    if (!req.params.limit) req.params.limit = 1;
    Sensor.findById(req.params.sensorid)
      .select('-__v')
      .populate({ path: 'data', select: '-__v -_id', options: { limit: req.params.limit } })
      .exec((err, sensor) => {
        res.send(sensor)
      });
  });

  return router;
}