var airportData;

$.getJSON('https://dl.dropboxusercontent.com/u/4292615/airports.json', function(data) {
    airportData = data;
  });

$('#flightform').submit(function(event) {
  event.preventDefault();
  queryTravel();
});

function queryTravel() {
  $('#tempframe').remove();
  var departAirport = $('#depart').val().toUpperCase();
  var arriveAirport = $('#arrive').val().toUpperCase();
  for(var i = 0; i < airportData.length; i++) {
    if(departAirport === airportData[i].iata) {
      var departCity = airportData[i].city;
      lat1 = airportData[i].latitude;
      lon1 = airportData[i].longitude;
    }
    if(arriveAirport === airportData[i].iata) {
      var arriveCity = airportData[i].city;
      lat2 = airportData[i].latitude;
      lon2 = airportData[i].longitude;
    }
  }
  if(!departCity || !arriveCity) {
    return alert('Please enter a valid airport code.');
  }
  var mapsURL = 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyCVzYqt4JIDK3C_xMQcNssaEKeDUxf45aA&origin='+ departAirport+' '+ departCity +'&destination='+ arriveAirport+' '+arriveCity +'&mode=flying';
  $('iframe').attr('src', mapsURL);
  $('#map').ScrollTo();
}

$('.uparrow').click(function() {
  $('.pageTop').ScrollTo();
  calcDistance();
});

// Spherical law of cosines calculation script from http://www.movable-type.co.uk/scripts/latlong.html

var lat1,lat2,lon1,lon2;

function toRadians(coord) {
  return coord * Math.PI/180;
}

function calcDistance() {
  var φ1 = toRadians(lat1), 
      φ2 = toRadians(lat2), 
      Δλ = toRadians(lon2-lon1), 
      R = 3959; // mi

var distanceTraveled = Math.round(Math.acos( Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R);
  
 console.log(distanceTraveled);
}


