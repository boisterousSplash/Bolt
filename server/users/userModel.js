var Q = require('q');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;


var UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: String,

  firstName: { type: String, default: "Speedee" },
  lastName: { type: String, default: "Gonzales" },
  email: String,
  phone: Number,
  preferedDistance: Number,
  mileSpeed: { type: Number, default: 10 }, // in min/mile
  runs: Array,
  // holds run objects, format should be {
  //   date: Date,
  //   startLocation: {
  //     longitude: String,
  //     latitude: String
  //   },
  //   endLocation: {
  //     longitude: String,
  //     latitude: String
  //   },
  //   googleExpectedTime: Number,
  //   actualTime: Number,
  //   medalRecieved: String,
  //   racedAgainst: ObjectID? String?
  // }

  personalBest: Number, // Personal best in min/mile
  acheivements: Object
  // Object of all lifetime medals received in following format:
  // {
  //   gold: 23,
  //   silver: 32,
  //   bronze: 9,
  //   iron: 2 -> (this is the experimental medal based on beating someone else's personal best)
  // }
});

UserSchema.methods.comparePasswords = function (candidatePassword) {
  var savedPassword = this.password;
  return Q.Promise(function (resolve, reject) {
    bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

module.exports = mongoose.model('users', UserSchema);
