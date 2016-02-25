angular.module('multirun.controller', [])

.controller('MultiRunController', function($scope, $location, $window, MultiGame) {
  $scope.session = $window.localStorage;
  console.log('gameId', $scope.session.gameId);
  $scope.competitor = $scope.session.competitor;
  // MultiGame.logMess();
});

