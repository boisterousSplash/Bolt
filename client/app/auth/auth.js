angular.module('bolt.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (session) {
        $window.localStorage.setItem('com.bolt', session.token);
        $window.localStorage.setItem('username', session.username);
        $window.localStorage.setItem('firstName', session.firstName);
        $window.localStorage.setItem('runs', session.runs);
        $window.localStorage.setItem('achievements', session.achievements);
        $location.path('/');
      })
      .catch(function (error) {
        $scope.errorDetected = true;
        $scope.signinError = "Hmm... we can't seem to find that username in our DB. Could it be another?";
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.bolt', token);
        $location.path('/createProfile');
      })
      .catch(function (error) {
        $scope.errorDetected = true;
        $scope.signupError = "Please enter both a username and a password";
      });
  };
});
