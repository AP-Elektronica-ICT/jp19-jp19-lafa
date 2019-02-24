const router = require('express').Router();

module.exports = function (app, pool) {

  // Get all data from a specific sensor
  router.get('/:id/:limit?', (req, res) => {
    pool.query({ text: 'SELECT * FROM "sensor_data" WHERE "parent" = $1 ORDER BY "time" DESC LIMIT $2', values: [req.params.id, req.params.limit | 20] }).then(data => {
      res.status(200).send(data.rows);
    }).catch(e => res.status(400).send(e));
  });

  return router;
};