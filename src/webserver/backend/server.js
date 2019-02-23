const express = require('express');
const app = express();
const api = require('./api');
const cors = require('cors');

app.use(cors());

app.use('/api', api);

app.get('/', (req, res) => {
  res.send('USE API ROUTES');
});

app.listen(3000);