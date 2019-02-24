const { validationResult } = require('express-validator/check');

module.exports = {
  valid: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return false;
    }
    return true;
  }
}