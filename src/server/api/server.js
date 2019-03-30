const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.sendStatus(403);
});

app.get('/', (req, res) => {
  res.sendStatus(403);
});

app.listen(3000, '0.0.0.0');