const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'docker',
  host: 'localhost',
  database: 'docker',
  password: 'docker',
  port: 5432,
});

router.get('/', (req, res) => {
  res.status(403)
  res.send('Forbidden');
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

module.exports = router;