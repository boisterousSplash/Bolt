var Game = require('./gameModel');
var Q = require('q');
var helpers = require('../config/helpers');


var findGame = Q.nbind(Game.findOne, Game);
var createGame = Q.nbind(Game.create, Game);


module.exports = {

  makeGame: function (req, res, next) {
    var user1 = req.body.user1;
    var user2 = req.body.user2;
    createGame({
      player1: user1,
      player2: user2,
      active: true
    })
    .then(function (newGame) {
      return newGame._id;
    });
  },

  cancelGame: function (req, res, next) {
    var gameId = req.body.gameId;
    findGame({_id : gameId})
      .then(function (targetGame) {
        targetGame.active = false;
      })
      .catch(function (err) {
        console.error(err);
      });
  }

};