angular.module('bolt.profile', ['bolt.auth'])

.controller('ProfileController', function ($scope, $rootScope, Auth, Profile) {
  $rootScope.user = {};
  $scope.newInfo = {};

  var getUserInfo = function () {
    Profile.getUser()
    .then(function (user) {
      $rootScope.user = user.data;
    })
    .catch(function (err) {
      console.error(err);
    });
  };

  $scope.signout = function () {
    Auth.signout();
  };

  $scope.update = function () {
    var newProperties = {};
    for (var property in $scope.newInfo) {
      newProperties[property] = $scope.newInfo[property];
      $scope.newInfo[property] = '';
    }

    Profile.updateUser(newProperties, $rootScope.user.username)
    .then( function(user) {
      $rootScope.user = user.data;
      //get the current user on rootScope
      getUserInfo();
    });
  };

  getUserInfo();
});
