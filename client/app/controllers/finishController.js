angular.module('finish.controller', [])
  // This controller is responsible for the finish.html view
  .controller('FinishController', function ($scope, $location, $route) {
    // This will set the route to the main /bolt page and give the access
    // to $scope
    $scope.raceAgain = function () {
      $route.reload('/bolt');
    };
});
