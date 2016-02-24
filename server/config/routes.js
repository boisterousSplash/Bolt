var userController = require('../users/userController.js');
var gameController = require('../game/multiGameController');
var helpers = require('./helpers.js'); // our custom middleware

module.exports = function (app, express) {
  app.get('/api/users/profile', userController.getUser);
  app.get('/api/users/signedin', userController.checkAuth);

  app.post('/api/games', gameController.makeGame);

  app.route('api/games/:game_id')
  .post(function(req, res) {
    console.log("posting req>>>>>>> ", req);
    Game.cancelGame(req.params.game_id, res);
  });

  app.post('/api/users/signin', userController.signin);
  app.post('/api/users/signup', userController.signup);

  app.put('/api/users/profile', userController.updateUser);

  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};
