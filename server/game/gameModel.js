var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  player1: Object,
  player2: Object,
  active: Boolean,
});

module.exports = mongoose.model('game', GameSchema);