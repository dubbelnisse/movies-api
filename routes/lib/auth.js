var express = require('express');
var router = express.Router();
var request = require('request');
var mongojs = require('mongojs');
var db = mongojs(process.env.MOVIES_MONGO_URL, [process.env.MOVIES_USERS]);
var bcrypt = require('bcrypt');

//Check if series exists
function auth(email, password, callback) {
  db.users.findOne({'email': email}, function(err, user) {
    if (err) return next(err);
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          return callback({
            message: 'logged in',
            hash: user.password
          });
        } else {
          return callback('wrong password');
        }
      } else {
        return callback('no user found');
      }
  });
}

module.exports.auth = auth;