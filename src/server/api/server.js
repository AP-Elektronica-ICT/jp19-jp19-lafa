const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const winston = require('winston');

// Logger
const logger = winston.createLogger();

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
} else {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
  logger.add(new winston.transports.File({
    filename: 'logs/api.log'
  }));
}

// Mongoose Connection
mongoose.connect('mongodb://database:27017/farmlab', { useNewUrlParser: true, useFindAndModify: false }).then(
  () => logger.info('Database Connected'),
  err => logger.error('Database Connection Error')
);

app.use(cors());
app.use(express.json());

mqtt = require('./core/mqtt')(mongoose, logger);

app.use('/nodes*', require('./routes/nodes')(mongoose, logger));
app.use('/actuators*', require('./routes/actuators')(mongoose, logger, mqtt));
app.use('/sensors*', require('./routes/sensors')(mongoose, logger, mqtt));
app.use('/user*', require('./routes/user')(mongoose, logger));

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(5000, '0.0.0.0', () => {
  logger.info('HTTP Server Running');
});