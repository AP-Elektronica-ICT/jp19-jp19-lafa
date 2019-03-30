const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }, (err) => { 
  if (err)
    console.log('Database connection error');
  else
    console.log('Database connected');
});

const apiV1Nodes = require('./v1/api')(app, mongoose);

app.use(cors());
app.use(express.json());

app.use('/v1/nodes', apiV1Nodes);

app.get('*', (req, res) => {
  res.sendStatus(403);
});

app.listen(3000, '0.0.0.0');