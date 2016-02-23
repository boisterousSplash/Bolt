angular.module('bolt.controller', [])

.controller('BoltController', function($scope, $window){
  $scope.session = $window.localStorage;
})
