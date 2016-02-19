angular.module('bolt.createProfile', [])

.controller('CreateProfileController', function($scope, Profile) {
  $scope.createProfile = function(first, last, email, phone, distance) {
    console.log(arguments);
    var newData = {
      first: first,
      last: last,
      email: email,
      phone: phone,
      distancePreference: distance
    };

    Profile.getUser()
    .then(function(currentUser) {
      Profile.updateUser(newData, currentUser);
    });

  };
})