var express = require('express');
var router = express.Router();

var auth = require('../routes/lib/auth');
var register = require('../routes/lib/register');

var mongojs = require('mongojs');
var db = mongojs(process.env.MOVIES_MONGO_URL, [process.env.MOVIES_USERS]);


/* POST login */
router.post('/', function(req, res, next) {
  var email = req.query.email;

  if(!email) {
    return res.send({
      code: 400,
      message: 'email missing',
    });
  }

  db.users.findOne({'email': email}, function(err, user) {
    if (err) return next(err);
      if (user) {
        return res.send({
          code: 200,
          username: user.username
        });
      } else {
        return res.send({
          code: 404,
          message: 'no user found'
        });
      }
  });
});

/* POST login */
router.post('/login', function(req, res, next) {
  var email = req.query.email;
  var password = req.query.password;

  if(!password) {
    return res.send({
      code: 400,
      message: 'password missing',
    });
  }

  if(!email) {
    return res.send({
      code: 400,
      message: 'email missing',
    });
  }

  auth.auth(email, password, function(result) {
    res.send(result);
  });

});

/* POST register */
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