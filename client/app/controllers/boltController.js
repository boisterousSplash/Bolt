angular.module('bolt.controller', [])

.controller('BoltController', function($scope, $location, $window){
  $scope.session = $window.localStorage;
  console.log('bolt controller session.... ', $scope.session);
  $scope.startRun = function() {
    if (document.getElementById("switch_3_left").checked) {
      $location.path('/run');
    } else if (document.getElementById("switch_3_center").checked) {
      // Eventually replace with friend matching route
      $location.path('/run');
    } else {
      $location.path('/multiLoad');
    }
  }
})