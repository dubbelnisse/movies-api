var express = require('express');
var router = express.Router();
var request = require('request');

var mongojs = require('mongojs');
var db = mongojs('movies', ['movies']);

/* GET home page. */
router.get('/', function(req, res, next) {
  db.movies.find(function(err, data) {
    if (err) return next(err);
    console.log(data.length);
    res.json(data);
  });
});

router.get('/latest', function(req, res, next) {
  var skip = !req.query.skip ? 0 : parseFloat(req.query.skip);
  var take = !req.query.take ? 10 : parseFloat(req.query.take);

  db.movies.find().limit(take).skip(skip).sort({last_watched:-1}, function(err, data) {
    if (err) return next(err);
    console.log(data.length);
    res.json(data);
  });
});

module.exports = router;
