const router = require('express').Router();
const { check } = require('express-validator/check');
const validator = require('../validator');

module.exports = function (app, pool) {

  // Get all data from a specific sensor
  router.get('/:id/:limit?', (req, res) => {
    pool.query({ text: 'SELECT * FROM "sensor_data" WHERE "parent" = $1 ORDER BY "time" DESC LIMIT $2', values: [req.params.id, req.params.limit | 20] }).then(data => {
      res.status(200).send(data.rows);
    }).catch(e => res.status(400).send(e));
  });

  // Add a sensor to a node
  router.post('/', [
    check('parent').isInt().withMessage('Invalid ID'),
    check('label').isLength({ min: 5, max: 64 }).withMessage('Label length does not meet requirements'),
    check('type').isLength({ min: 1, max: 64 }).withMessage('Type length does not meet requirements'),
    check('min').isFloat().withMessage('Invalid minimum value'),
    check('max').isFloat().withMessage('Invalid maximum value'),
  ], (req, res) => {
    if (!validator.valid(req, res)) return;
    pool.query({
      text: 'INSERT INTO sensors(parent, label, type, min, max) VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [req.body.parent, req.body.label, req.body.type, req.body.min, req.body.max]
    }).then(data => {
      res.status(200).send(data.rows);
    }).catch(e => res.status(400).send(e));
  });

  // Add a data point from a specific sensor
  router.post('/:id/data', [
    check('parent').isInt().withMessage('Invalid ID'),
    check('value').isFloat().withMessage('Invalid Value')
  ], (req, res) => {
    if (!validator.valid(req, res)) return;
    pool.query({ text: 'INSERT INTO sensor_data(parent, value) VALUES($1, $2) RETURNING *', values: [req.body.parent, req.body.value] }).then(data => {
      res.status(200).send(data.rows);
    }).catch(e => res.status(400).send(e));
  });

  return router;
};