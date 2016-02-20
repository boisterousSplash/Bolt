angular.module('bolt.createProfile', [])

.controller('CreateProfileController', function($scope, Profile) {
  $scope.createProfile = function(first, last, email, phone, distance) {
    var newData = {
      first: first,
      last: last,
      email: email,
      phone: phone.toString(),
      distancePreference: distance
    };

    Profile.getUser()
    .then(function(currentUser) {
      Profile.updateUser(newData, currentUser);
    });

  };
})