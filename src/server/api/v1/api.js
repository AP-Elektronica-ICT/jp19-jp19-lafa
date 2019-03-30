const router = require('express').Router();

module.exports = function (app, db) {

  router.get('/:id', (req, res) => {
    res.sendStatus(201);
  });

  router.get('/', (req, res) => {
    res.sendStatus(404);
  });

  return router;
};