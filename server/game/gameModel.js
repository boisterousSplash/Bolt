var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  user1: Object,
  user2: Object,
  active: Boolean,
});

module.exports = mongoose.model('game', GameSchema);