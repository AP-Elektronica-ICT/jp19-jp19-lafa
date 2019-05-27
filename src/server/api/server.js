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
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Mongoose Connection
mongoose.connect('mongodb://database:27017/farmlab', { useNewUrlParser: true, useFindAndModify: false }).then(
  () => logger.info('Database Connected'),
  err => logger.error('Database Connection Error')
);

app.use(cors());
app.use(express.json());

mqttServer = require('./mqtt')(mongoose, logger);

app.use('/nodes*', require('./routes/nodes')(mongoose, logger));
app.use('/actuators*', require('./routes/actuators')(mongoose, logger, mqttServer));
app.use('/sensors*', require('./routes/sensors')(mongoose, logger, mqttServer));

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(5000, '0.0.0.0', () => {
  logger.info('HTTP Server Running');
});