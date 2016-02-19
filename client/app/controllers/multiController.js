angular.module('multi.Controller', [])

.controller('MultiController', function(){

	$scope.stopGeoUpdater = function() {
	  clearInterval($scope.geoUpdater);
	};
	
})