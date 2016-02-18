// var getCoords = function() {
  // console.log('fuck');
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position.coords.latitude, position.coords.longitude);
    makeMap({lat: position.coords.latitude, lng: position.coords.longitude});  
  }, function(err) {
    console.error(err);
  });
  // console.log(navigator.geolocation);
// };
var map;
var marker;
var makeMap = function(latLngObj) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: latLngObj,
    zoom: 15
  });
  marker = new google.maps.Marker({
    position: latLngObj,
    map: map
  });
};