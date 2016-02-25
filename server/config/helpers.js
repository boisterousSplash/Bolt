var jwt = require('jwt-simple');

module.exports = {

  // Getus user from db, returns a promise of that user
  applyToUser: function (user) {
    if ((typeof user) === 'string') {
      user = {username: user};
    }
    return findUser({username: username})
    .then(function (user) {
      if (!user) {
        next(new Error('User does not exist'));
      } else {
        return user;
      }
    });
  },

  errorLogger: function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  },
  errorHandler: function (error, req, res, next) {
    res.send(500, {error: error.message});
  },
  decode: function (req, res, next) {
    var token = req.headers['x-access-token'];
    var user;

    if (!token) {
      return res.send(403); // send forbidden if a token is not provided
    }

    try {
      user = jwt.decode(token, 'secret');
      req.user = user;
      next();
    } catch (error) {
      return next(error);
    }
  }
};
