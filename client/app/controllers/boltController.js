angular.module('bolt.controller', [])

.controller('BoltController', function($scope, Geo){
  $scope.currentCoords = {
    lat: null,
    lng: null
  };
  $scope.getCurrentCoords = function() {
    console.log('ran');
    Geo.getCurrentCoords(function(coordsObj) {
      $scope.currentCoords = coordsObj;
      console.log('$scope.currentCoords.lat: ', $scope.currentCoords.lat);
      console.log('$scope.currentCoords.lng: ', $scope.currentCoords.lng);
    });
  };

  // setInterval($scope.getCurrentCoords, 500);
})
