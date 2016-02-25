angular.module('multigame.controller', [])

.controller('MultiGameController', function($scope, $location, $window, MultiGame) {
  $scope.session = $window.localStorage;
  MultiGame.logMess();
});

