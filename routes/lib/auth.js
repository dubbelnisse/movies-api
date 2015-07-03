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
        if (bcrypt.compareSync(password, user.hash)) {
          console.log(user);
          return callback({
            code: 200,
            message: 'logged in',
            hash: user.hash
          });
        } else {
          return callback({
            code: 400,
            message: 'wrong password',
          });
        }
      } else {
        return callback({
          code: 404,
          message: 'no user found',
        });
      }
  });
}

module.exports.auth = auth;