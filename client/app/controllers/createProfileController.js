angular.module('bolt.createProfile', [])

.controller('CreateProfileController', function ($location, $scope, Profile, $window) {
  $scope.createProfile = function (first, last, email, phone, distance) {
    $location.path('/');

    var newData = {
      firstName: first,
      lastName: last,
      email: email,
      phone: phone.toString(),
      preferredDistance: distance
    };

    $window.localStorage.setItem('firstName', first);
    $window.localStorage.setItem('lastName', last);
    $window.localStorage.setItem('phone', phone);
    $window.localStorage.setItem('email', email);
    $window.localStorage.setItem('preferredDistance', distance);

    Profile.getUser()
    .then(function (currentUser) {
      Profile.updateUser(newData, currentUser)
      .catch(function (err) {
        console.error(err);
      });
    });
  };
});
