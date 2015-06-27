var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs(process.env.MOVIES_MONGO_URL, [process.env.MOVIES_USERS]);

var bcrypt = require('bcrypt');

/* GET users */
router.get('/', function(req, res, next) {
  db.users.find(function(err, users) {
    if (err) return next(err);
      res.send(users);
  });
});

module.exports = router;
