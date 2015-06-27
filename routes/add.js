var express = require('express');
var router = express.Router();
var request = require('request');
var moment = require('moment');

var mongojs = require('mongojs');
var db = mongojs(process.env.MOVIES_MONGO_URL, [process.env.MOVIES_MOVIES]);

var api = 'http://api.themoviedb.org/3/movie/';
var apiKey = '?api_key=27cfec6c9eb8080cb7d8025ba420e2d7';

function isInteger(str) {
  return /^\+?(0|[1-9]\d*)$/.test(str);
}

/* POST add movie */
router.post('/', function(req, res, next) {
  var id = req.query.id;
  var rating = req.query.rating;
  var date = req.query.date;

  if (!id) {
    return res.status(400).send('ID is mandatory');
  }

  if (!rating) {
    return res.status(400).send('Rating is mandatory');
  }
  
  if (rating > 10) {
    return res.status(400).send('Maximum rating is 10');
  }

  if (!isInteger(rating)) {
    return res.status(400).send('Only integers in ratings');
  }

  if (!date) {
    date = moment().format();
  }

  db.movies.findOne({$or: [{'ids.tmdb': id}, {'ids.imdb': id}]}, function(err, data) {
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
        res.status(200).send('Great! Movie has been added!');
      });
    } else {
      request(api + id + apiKey, function (error, response, body) {
        data = JSON.parse(body);
        if (!error && response.statusCode == 404) {
          return res.status(404).send('No movie found with that ID');
        } else if (!error && response.statusCode == 200) {
          db.movies.save({
            title: data.original_title,
            last_watched: date,
            plays: 1,
            year: parseInt(moment(data.release_date).format('YYYY'), 10),
            ids: {
              tmdb: data.id.toString(),
              imdb: data.imdb_id
            },
            rating: rating,
            backdrop_path: data.backdrop_path,
            genres: data.genres,
            original_language: data.original_language,
            info: data.overview,
            poster_path: data.poster_path,
            production_companies: data.production_companies,
            release_date: data.release_date,
            runtime: data.runtime,
            tagline: data.tagline
          }, function(err, saved) {
            if (err) return next(err);
            res.status(200).send('Great! Movie has been added!');
          });
        }
      });
    }
  });
});

module.exports = router;