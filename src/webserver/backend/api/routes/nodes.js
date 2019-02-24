const router = require('express').Router();
const { check } = require('express-validator/check');
const validator = require('../validator');

module.exports = function (app, pool) {

  // Get all nodes in a cluster
  router.get('/', (req, res) => {
      let resp;
      pool.query({ text: 'SELECT * FROM "nodes"' }).then(data => {
        resp = data.rows;
        res.status(200).send(resp);
      }).catch(e => res.status(400).send(e));
    });

  // Add a node to a cluster
  router.post('/', [
      check('label').isLength({ min: 5, max: 64 }).withMessage('Label length does not meet requirements')
    ], (req, res) => {
      if (!validator.valid(req, res)) return;
      pool.query({ text: 'INSERT INTO nodes(label) VALUES($1) RETURNING *', values: [req.body.label] }).then(data => {
        res.status(200).send(data.rows);
      }).catch(e => res.status(400).send(e));
    });

  // Get all sensors from a specific node
  router.get('/:id/sensors', (req, res) => {
    pool.query({ text: 'SELECT * FROM "sensors" WHERE "parent" = $1', values: [req.params.id] }).then(data => {
      res.status(200).send(data.rows);
    }).catch(e => res.status(400).send(e));
  });

  return router;
};