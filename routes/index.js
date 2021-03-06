var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs(process.env.MOVIES_MONGO_URL, [process.env.MOVIES_MOVIES]);

/* GET root */
router.get('/', function(req, res, next) {
  db.movies.find(function(err, data) {
    if (err) return next(err);
    res.send(data);
  });
});

module.exports = router;
