const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

router.get('/', (req, res) => {
  res.status(400)
  res.send('Forbidden');
});