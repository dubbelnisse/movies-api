var express = require('express');
var router = express.Router();

var auth = require('../routes/lib/auth');
var register = require('../routes/lib/register');

/* GET user */
router.post('/login', function(req, res, next) {
  var email = req.query.email;
  var password = req.query.password;

  if(!password) {
    return res.status(400).send('password missing');
  }

  if(!email) {
    return res.status(400).send('email missing');
  }

  auth.auth(email, password, function(result) {
    res.send(result);
  });

});

router.post('/register', function(req, res, next) {
  var email = req.query.email;
  var password = req.query.password;

  if(!password) {
    return res.status(400).send('password missing');
  }

  if(!email) {
    return res.status(400).send('email missing');
  }

  register.register(email, password, function(result) {
    res.send(result);
  });

});

module.exports = router;