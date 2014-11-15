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
    }
    if(arriveAirport === airportData[i].iata) {
      var arriveCity = airportData[i].city;
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
});