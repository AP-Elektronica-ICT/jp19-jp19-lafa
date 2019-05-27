const router = require('express').Router({ mergeParams: true });
const userSchema = require('../models/user').user;
const axios = require('axios');

module.exports = (db, logger) => {
  const User = db.model('User', userSchema);

  /**
   * Authenticate User
   * @returns {}
   */
  router.route('/').post((req, res) => {
    axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': 'Bearer ' + req.body.authToken
      }
    })
    .then(data => {
      // Fix: Security Issue (using a static and possibly publicly available token as a private bearer token is insecure)
      User.findOne({ "msuid": data.id }).select('_id').exec((err, user) => {
        if (user) {
          res.send({ success: true, token: user.msuid });
        } else {
          logger.warn(`User ${ data.id } doesn't have an entry`);
          createUser(data.data, req.body.authToken);
          res.send({ success: true, token: data.data.id });
        }
      })
    })
    .catch(err =>  {
      console.log(err);
      res.send({ success: false });
    });
  });

  function createUser(data, token) {
    user = new User({
      firstname: data.givenName,
      lastname: data.surname,
      email: data.mail,
      username: data.userPrincipalName,
      accessToken: token,
      msuid: data.id,
    });
    user.save();
    logger.info(`Added user ${ user.firstname } with id ${ user.id }`);
  }

  return router;
}