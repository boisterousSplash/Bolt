angular.module('finish.controller', [])
  .controller('FinishController', function ($scope, $location, $route) {
    $scope.raceAgain = function () {
      $route.reload('/bolt');
    }
});
