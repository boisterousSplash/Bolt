var Game = require('./multiGameModel');
var Q = require('q');
var helpers = require('../config/helpers');


var findGame = Q.nbind(Game.findOne, Game);
var createGame = Q.nbind(Game.create, Game);


module.exports = {

  makeGame: function (req, res, next) {
    var user1 = req.body.user1;
    var user2 = req.body.user2;
    var id = req.body.id;
    findGame({id:id}).then(function(game) {
      if (user) {
        res.send(201, game);
      } else {
        createGame({
          id: id,
          user1: user1,
          user2: user2,
          active: true
        })
        .then(function (newGame) {
          console.log(newGame);
          res.send(201, newGame._id);
        });
      }
    });
  },

  getGame: function (gameId, res, next) {
    // var id = req.body.id;
    console.log('gameId...', gameId);
    findGame({id:gameId}).then(function(game) {
      res.send(201, game);
    });
  },

  cancelGame: function (gameId, res) {
    findGame({_id : "ObjectId(" + gameId + ")"})
      .then(function (targetGame) {
        console.log(targetGame);
        targetGame.active = false;
        res.send(201, targetGame);
      })
      .catch(function (err) {
        console.error(err);
      });
  }
};