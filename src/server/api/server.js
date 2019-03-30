const express = require('express');
const app = express();
const cors = require('cors');

const apiVersion1 = require('./v1/api')(app);

app.use(cors());
app.use(express.json());

app.use('/v1*', apiVersion1);

app.get('*', (req, res) => {
  res.sendStatus(403);
});

app.listen(3000, '0.0.0.0');