const router = require('express').Router();

module.exports = function (app) {

  router.get('/', (req, res) => {
    res.sendStatus(200);
  });

  return router;
};