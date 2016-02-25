var mongoose = require('mongoose');

var MultiGameSchema = new mongoose.Schema({
  id: {type: String, required: true},
  user1: {type: Boolean, default: false},
  user2: {type: Boolean, default: false},
  canceled: {type: Boolean, default: false},
  won: {type: Boolean, default: false}
});

module.exports = mongoose.model('multiGame', MultiGameSchema);