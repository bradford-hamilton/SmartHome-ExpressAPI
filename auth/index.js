require('dotenv').config();
var express = require('express');
var router = express.Router();
var db = require('../db/queries');
var auth = require('./utils.js');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

router.post('/signup', function(request, response) {
  db.findUserByUsername(request.query.username)
  .then(function(user) {
    if (user) {
      response.json({
        error: 'Username already exists'
      });
    } else {
      auth.createUser(request.query)
      .then(function(id) {
        response.json({
          message: 'User created successfully'
        });
      });
    }
  });
});

router.post('/login', function(request, response, next) {
  db.findUserByUsername(request.query.username)
  .then(function(user) {
    // console.log(user)
      var plainTextPassword = request.query.password;
      if (user && bcrypt.compareSync(plainTextPassword, user.password) ) {
        // console.log(user)
        delete user.password;
        jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: '1d'}, function(err, token) {
          if (err) {
            response.json({
              message: 'Error creating token'
            });
          } else {
            response.json({
              token: token,
              userId: user.id,
              username: user.username,
              zip: user.zip,
              phone: user.phone
            });
          }
        });
      } else {
        response.status(401);
        response.json({
          message: 'Unauthorized'
        });
      }
    }).catch(function(err) {
      response.status(503);
      response.json({
        message: err
      });
    });
});

module.exports = router;
