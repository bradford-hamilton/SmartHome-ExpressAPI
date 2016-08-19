require('dotenv').config();
var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    message: 'We are in great success!'
  });
});

router.get('/weather', function(req, res, next) {
  request("http://api.aerisapi.com/forecasts/" + req.query.zip + "?client_id=" +
  process.env.CLIENT_ID + "&client_secret=" + process.env.CLIENT_SECRET, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var parsed = JSON.parse(body);
      res.json(parsed);
    }
  });
});

module.exports = router;
