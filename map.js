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
var destinationMarker;
var makeMap = function(currentLatLngObj) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: currentLatLngObj,
    zoom: 14
  });
  marker = new google.maps.Marker({
    position: currentLatLngObj,
    map: map,
    animation: google.maps.Animation.DROP,
    icon: './bolt.png'
  });
  destinationMarker = new google.maps.Marker({
    position: randomCoordsAlongCircumference(currentLatLngObj, 1),
    map: map,
    animation: google.maps.Animation.DROP,
    icon: './finish-line.png' // change to finish line image
  });
};

var randomCoordsAlongCircumference = function(originObj, radius) {
  var randomTheta = Math.random() * 2 * Math.PI;
  console.log('called');
  console.log('randomTheta: ', randomTheta);
  console.log('current lat and long: ');
  console.log(originObj);
  console.log('random lat: ', originObj.lat + (radius * Math.cos(randomTheta)));
  console.log('random lng: ', originObj.lng + (radius * Math.sin(randomTheta)));
  return {
    lat: originObj.lat + (radius / 69 * Math.cos(randomTheta)),
    lng: originObj.lng + (radius / 69 * Math.sin(randomTheta))
  };
};