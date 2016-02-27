angular.module('bolt.createProfile', ['bolt.auth'])

.controller('CreateProfileController', function ($location, $scope, Profile, $window, Auth) {
  $scope.inputData = {};
  $scope.createProfile = function (inputData) { //first, last, email, phone, distance) {
    $location.path('/profile');
    newData = {
      firstName: $scope.session.firstName,
      lastName: $scope.session.lastName,
      email: $scope.session.email,
      phone: $scope.session.phone,
      preferredDistance: $scope.session.preferredDistance
    };

    for (var key in inputData) {
      if (inputData.hasOwnProperty(key) && inputData[key]) {
        newData[key] = inputData[key];
        $window.localStorage.setItem(key, inputData[key]);
      }
    }

    Profile.getUser()
    .then(function (currentUser) {
      Profile.updateUser(newData, currentUser)
      .catch(function (err) {
        console.error(err);
      });
    });
  };

  $scope.session = window.localStorage;

  $scope.signout = function () {
    Auth.signout();
  };
});
