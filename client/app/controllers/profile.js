angular.module('bolt.profile', ['bolt.auth'])

.controller('ProfileController', function ($scope, $rootScope, $window, Auth, Profile) {
  $scope.newInfo = {};
  $scope.session = window.localStorage;

  var getUserInfo = function () {
    Profile.getUser()
    .then(function (currentUser) {
      // $window.localStorage.setItem('username', currentUser.username);
      // $window.localStorage.setItem('firstName', currentUser.firstName);
      // $window.localStorage.setItem('lastName', currentUser.lastName);
      // $window.localStorage.setItem('phone', currentUser.phone);
      // $window.localStorage.setItem('email', currentUser.email);
      // $window.localStorage.setItem('preferredDistance', currentUser.preferredDistance);
      // $window.localStorage.setItem('runs', currentUser.runs);
      // $window.localStorage.setItem('achievements', currentUser.achievements);
    })
    .catch(function (err) {
      console.error(err);
    });
  };

  $scope.signout = function () {
    Auth.signout();
  };

  getUserInfo();
});
