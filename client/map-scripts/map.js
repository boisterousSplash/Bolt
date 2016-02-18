navigator.geolocation.getCurrentPosition(function(position) {
  makeMap({lat: position.coords.latitude, lng: position.coords.longitude});  
}, function(err) {
  console.error(err);
});
var map;
var marker;
var destinationMarker;
var makeMap = function(currentLatLngObj) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: currentLatLngObj,
    zoom: 13
  });
  marker = new google.maps.Marker({
    position: currentLatLngObj,
    map: map,
    animation: google.maps.Animation.DROP,
    icon: '/assets/bolt.png'
  });
  destinationMarker = new google.maps.Marker({
    position: randomCoordsAlongCircumference(currentLatLngObj, 1),
    map: map,
    animation: google.maps.Animation.DROP,
    icon: '/assets/finish-line.png' // change to finish line image
  });
};

var randomCoordsAlongCircumference = function(originObj, radius) {
  var randomTheta = Math.random() * 2 * Math.PI;
  return {
    lat: originObj.lat + (radius / 69 * Math.cos(randomTheta)),
    lng: originObj.lng + (radius / 69 * Math.sin(randomTheta))
  };
};