angular.module('bolt.profile', ['bolt.auth'])

.controller('ProfileController', function ($scope, $rootScope, $window, Auth, Profile) {
  $scope.newInfo = {};
  $scope.session = window.localStorage;

  var getUserInfo = function () {
    Profile.getUser()
    .catch(function (err) {
      console.error(err);
    });
  };

  $scope.signout = function () {
    Auth.signout();
  };

  getUserInfo();
});
