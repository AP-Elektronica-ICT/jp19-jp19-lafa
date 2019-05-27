const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const winston = require('winston');

// Logger
const logger = winston.createLogger({
  transports: [
    // new winston.transports.Console()
    // new winston.transports.File({ filename: 'api.log' })
  ],
  // levels: {
  //   levels: { 
  //     error: 0, 
  //     warn: 1, 
  //     info: 2, 
  //     verbose: 3, 
  //     debug: 4
  //   },
  //   colors: {
  //     error: 'red', 
  //     warn: 'orange', 
  //     info: 'blue', 
  //     verbose: 'white', 
  //     debug: 'white'
  //   }
  // }
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Mongoose Connection
mongoose.connect('mongodb://database:27017/data', { useNewUrlParser: true, useFindAndModify: false }).then(
  () => logger.info('Mongoose Connected'),
  err => logger.error('Database Connection Error')
);

app.use(cors());
app.use(express.json());

app.use('/v1', require('./v1/api')(mongoose, logger));
// For debug purposes only
// app.use('/populate', require('./v1/populate')(mongoose));

app.get('*', (req, res) => {
  res.sendStatus(403);
});

app.listen(5000, '0.0.0.0', () => {
  logger.info('HTTP Server running on 0.0.0.0:5000');
});