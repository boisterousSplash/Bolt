var Game = require('./multiGameModel');
var Q = require('q');
var helpers = require('../config/helpers');


var findGame = Q.nbind(Game.findOne, Game);
var createGame = Q.nbind(Game.create, Game);
var updateGame = Q.nbind(Game.update, Game);

module.exports = {

  makeGame: function (req, res, next) {
    console.log('making game....');
    var id = req.body.id;
    findGame({id:id}).then(function(game) {
      if (game) {
        res.send(201, game);
      } else {
        createGame({
          id: id
        })
        .then(function (newGame) {
          console.log(newGame);
          res.send(201, newGame._id);
        });
      }
    });
  },

  getGame: function (gameId, res, next) {
    console.log('gameId...', gameId);
    findGame({id:gameId}).then(function(game) {
      res.send(201, game);
    });
  },

  updateGame: function (req, res, next) {
    console.log('req.body... ', req.body)
    var id = req.body.id;
    var field = req.body.field;
    var updateQuery = {$set: {}};
    updateQuery.$set[field] = true;
    updateGame({id:id}, updateQuery).then(function(game) {
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