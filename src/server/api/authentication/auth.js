const router = require('express').Router({ mergeParams: true });
const axios = require('axios');

module.exports = function (db, logger) {

  router.route('/').post((req, res) => {
    axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': 'Bearer ' + req.body.authToken
      }
    })
    .then(response => res.send(response.data));
  });

  return router;
}