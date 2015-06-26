var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs('movies', ['movies']);

/* GET latest */
router.get('/', function(req, res, next) {
  var skip = !req.query.skip ? 0 : parseInt(req.query.skip, 10);
  var take = !req.query.take ? 10 : parseInt(req.query.take, 10);

  db.movies.find().limit(take).skip(skip).sort({last_watched:-1}, function(err, data) {
    console.log(err);
    if (err) return next(err);
    res.json(data);
  });
});

module.exports = router;