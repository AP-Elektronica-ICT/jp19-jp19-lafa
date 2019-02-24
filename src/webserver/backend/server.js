const express = require('express');
const app = express();
const api = require('./api');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/api', api);

app.get('/', (req, res) => {
  res.send('USE API ROUTES');
});

// all docker exposed traffic needs to go to the IP 0.0.0.0 see frontend for more info
app.listen(3000, '0.0.0.0');
