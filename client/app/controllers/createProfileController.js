angular.module('bolt.createProfile', [])

.controller('CreateProfileController', function($location, $scope, Profile) {
  $scope.createProfile = function(first, last, email, phone, distance) {
    $location.path('/');

    var newData = {
      firstName: first,
      lastName: last,
      email: email,
      phone: phone.toString(),
      preferedDistance: distance
    };

    Profile.getUser()
    .then(function(currentUser) {
      Profile.updateUser(newData, currentUser);
    });

  };
})
