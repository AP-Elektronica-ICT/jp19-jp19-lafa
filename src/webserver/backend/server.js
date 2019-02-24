const express = require('express');
const app = express();
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'docker',
  host: 'db',
  // host: 'localhost',
  database: 'docker',
  password: 'docker',
  port: 5432,
});

const nodesRoute = require('./api/routes/nodes')(app, pool);
const sensorsRoute = require('./api/routes/sensors')(app, pool);

app.use(cors());
app.use(express.json());

app.use('/api/nodes', nodesRoute);
app.use('/api/sensors', sensorsRoute);

app.get('/api', (req, res) => {
  res.sendStatus(403);
});

app.get('/', (req, res) => {
  res.sendStatus(403);
});

app.listen(3000, '0.0.0.0');
