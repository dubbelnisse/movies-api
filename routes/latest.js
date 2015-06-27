var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs(process.env.MOVIES_MONGO_URL, [process.env.MOVIES_MOVIES]);

/* GET latest */
router.get('/', function(req, res, next) {
  var skip = !req.query.skip ? 0 : parseInt(req.query.skip, 10);
  var take = !req.query.take ? 10 : parseInt(req.query.take, 10);

  db.movies.find().limit(take).skip(skip).sort({last_watched:-1}, function(err, data) {
    if (err) return next(err);
    res.send(data);
  });
});

module.exports = router;