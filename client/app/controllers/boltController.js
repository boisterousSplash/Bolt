angular.module('bolt.controller', [])

.controller('BoltController', function($scope, $location){
  $scope.startRun = function() {
    if (document.getElementById("switch_3_left").checked) {
      $location.path('/run');
    }
  }
})
