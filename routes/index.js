var express = require('express');
var router = express.Router();
var request = require('request');
var moment = require('moment');

var mongojs = require('mongojs');
var db = mongojs('movies', ['movies']);

function isInteger(str) {
  return /^\+?(0|[1-9]\d*)$/.test(str);
}

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

router.post('/add', function(req, res, next) {
  var id = req.query.id;
  var rating = req.query.rating;
  var date = req.query.date;

  var parsedId = parseInt(id, 10);

  if (!id || !rating) {
    return res.send('Missing a parameter!');
  }
  
  if (rating > 10) {
    return res.send('Maximum rating is 10!');
  }

  if (!isInteger(rating)) {
    return res.send('Only integer!');
  }

  if (!date) {
    date = moment().format();
  }

  db.movies.findOne({$or: [{'ids.tmdb': parsedId}, {'ids.imdb': id}]}, function(err, data) {
    if (err) return next(err);
    if (data) {
      var updateedPlays = data.plays + 1;
      db.movies.update(
        {_id: data._id}, 
        {$set: {
          rating: rating,
          plays: updateedPlays,
          last_watched: date 
        }
      }, function(err, updated) {
        if( err || !updated ) console.log('Oooops');
        res.send('Movie updated!');
      });
    } else {
      res.send('Nope');
    }
  });
});

module.exports = router;
