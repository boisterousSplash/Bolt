angular.module('achievements.controller', [])
  .controller('AchievementsController', function ($scope) {

    $scope.gold = 15; // Place holder for user-specific data
    $scope.silver = 13; // Place holder for user-specific data
    $scope.bronze = 5; // Place holder for user-specific data

    var medalCounts = [
      $scope.gold.toString(),
      $scope.silver.toString(),
      $scope.bronze.toString()
    ];

    $scope.incrementCounts = function (width) {
      selection = d3.select("body")
        .selectAll("span.number")
        .data(medalCounts);
      selection.transition()
      .tween("html", function (d) {
        var i = d3.interpolate(this.textContent, d);
        return function (t) {
          this.textContent = Math.round(i(t));
        };
      })
      .duration(1500)
      .style('width', width + 'px');
    };

    $scope.incrementCounts();

  });
