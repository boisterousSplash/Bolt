// var getCoords = function() {
  // console.log('fuck');
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position.coords.latitude, position.coords.longitude);
    makeMap(position.coords.latitude, position.coords.longitude);  
  }, function(err) {
    console.error(err);
  });
  // console.log(navigator.geolocation);
// };
var map;
var makeMap = function(lat, lng) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: lat,
      lng: lng
    },
    zoom: 8
  });
};