var express = require('express');
var router = express.Router();
var request = require('request');
var mongojs = require('mongojs');
var db = mongojs(process.env.MOVIES_MONGO_URL, [process.env.MOVIES_USERS]);
var bcrypt = require('bcrypt');

//Check if series exists
function register(email, password, callback) {
  db.users.findOne({'email': email}, function(err, user) {
    if (err) return next(err);
      if (user) {
        return callback('email already registerd');
      } else {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        db.users.save({
          email: email,
          password: hash
        }, function(err, saved) {
          if (err) return next(err);
          var clean = {
            email: saved.email,
            password: saved.password
          }
          return callback(clean);
        });
      }
  });
}

module.exports.register = register;