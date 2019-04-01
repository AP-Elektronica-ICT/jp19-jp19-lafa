const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect('mongodb://database:27017/data', { useNewUrlParser: true }, (err) => { 
  if (err)
    console.log('Database Connection Error');
  else
    console.log('Database Connected');
});

app.use(cors());
app.use(express.json());

app.use('/v1', require('./v1/api')(mongoose));
app.use('/populate', require('./v1/populate')(mongoose));

app.get('*', (req, res) => {
  res.sendStatus(403);
});

app.listen(3000, '0.0.0.0', () => {
  console.log('HTTP Server Running');
});