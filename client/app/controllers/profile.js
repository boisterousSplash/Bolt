angular.module('bolt.profile', ['bolt.auth'])

.controller('ProfileController', function ($scope, Auth, Profile) {
  $rootScope.user = {};
  $scope.newInfo = {};

  var getUserInfo = function () {
    Profile.getUser()
    .then(function (user) {
      $rootScope.user = user;
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
      $rootScope.user = user;
      getUserInfo();
    });
  };

  $scope.$on('$routeChangeSuccess', function () {
    getUserInfo();
    console.log('loading!');
  // do something
  });
});
