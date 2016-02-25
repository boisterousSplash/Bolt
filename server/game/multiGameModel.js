var mongoose = require('mongoose');

var MultiGameSchema = new mongoose.Schema({
  id: {type:String, unique:true},
  user1: Object,
  user2: Object,
  active: Boolean,
});

module.exports = mongoose.model('multiGame', MultiGameSchema);