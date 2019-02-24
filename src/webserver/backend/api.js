const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
// const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');

// Parser
// const jsonParser = bodyParser.json()
// const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Connect to PostgreSQL
// Use docker network to connect to the database (see link in docker-compose file)
// The URL to connect to postgres should be in the form of postgres://db:5432/<database> where db is the host address
// That is resolved by docker and 5432 the port inside the database container (not exposed)

const pool = new Pool({
  user: 'docker',
  host: 'db',
  database: 'docker',
  password: 'docker',
  port: 5432,
});

router.get('/', (req, res) => {
  return res.sendStatus(403);
});

// Get all nodes in a cluster
router.route('/nodes').get((req, res) => {
  let resp;
  pool.query({ text: 'SELECT * FROM "nodes"' }).then(data => {
    resp = data.rows;
    res.status(200).send(resp);
  }).catch(e => res.status(400).send(e));
});

// Get all sensors from a specific node
router.get('/node/:id/sensors', (req, res) => {
  pool.query({ text: 'SELECT * FROM "sensors" WHERE "parent" = $1', values: [req.params.id] }).then(data => {
    res.status(200).send(data.rows);
  }).catch(e => res.status(400).send(e));
});

// Get all data from a specific sensor
router.get('/sensor/:id/:limit?', (req, res) => {
  pool.query({ text: 'SELECT * FROM "sensor_data" WHERE "parent" = $1 ORDER BY "time" DESC LIMIT $2', values: [req.params.id, req.params.limit | 20] }).then(data => {
    res.status(200).send(data.rows);
  }).catch(e => res.status(400).send(e));
});

router.post('/nodes', [
  check('label').isLength({ min: 5, max: 64 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  res.status(200).send(req.body);
});

module.exports = router;