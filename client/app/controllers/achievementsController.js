angular.module('achievements.controller', [])
  .controller('AchievementsController', function($scope) {
    $scope.gold = 15;
    $scope.silver = 13;
    $scope.bronze = 5;

    var medalCounts = [$scope.gold.toString(), $scope.silver.toString(), $scope.bronze.toString()];


    $scope.incrementCounts = function(width) {
      selection = d3.select("body").selectAll("span.number").data(medalCounts);
      selection.transition()
      .tween("html", function(d) {
        var i = d3.interpolate(this.textContent, d);
        return function(t) {
        this.textContent = Math.round(i(t));
      };
      })
      .duration(1500)
      .style('width', width + 'px')
    }

    $scope.incrementCounts();
    
  });
