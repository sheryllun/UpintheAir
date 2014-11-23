var airportData;

$.getJSON('https://dl.dropboxusercontent.com/u/4292615/airports.json', function(data) {
    airportData = data;
  });

var planeFacts = {
  longDistance: {
    cruisingAlt: 39000,
    avgSpeed: 550,
    hoursInAir: function(distance) {
      var time = ((distance / this.avgSpeed)*60) + 60;
      var hours = Math.floor(time/60);
      var minutes = Math.round(time % 60);
      return hours + " hours and " + minutes + " minutes";
    },
    planeType: "Boeing 767,<br>Boeing 777,<br>and Airbus A380",
    flightAttendants: "4-6",
    avgPeople: "250-375",
    meal: "Very likely"
  },
  medDistance: {
    cruisingAlt: 35000,
    avgSpeed: 530,
    hoursInAir: function(distance) {
      var time = ((distance / this.avgSpeed)*60) + 60;
      var hours = Math.floor(time/60);
      var minutes = Math.round(time % 60);
      return hours + " hours and " + minutes + " minutes";
    },
    planeType: "Airbus A321,<br>Airbus A319,<br>and Boeing 757",
    flightAttendants: "2-4",
    avgPeople: "100-250",
    meal: "Maybe: depends on the generosity of your airline."
  },
  shortDistance: {
    cruisingAlt: 34000,
    avgSpeed: 515,
    hoursInAir: function(distance) {
      var time = ((distance / this.avgSpeed)*60) + 30;
      var hours = Math.floor(time/60);
      var minutes = Math.round(time % 60);
      return hours + " hours and " + minutes + " minutes";
    },
    planeType: "Bombardier CRJ-200 and<br>Embraer ERT-140",
    flightAttendants: "1-2",
    avgPeople: "20-100",
    meal: "Probably not"
  }
}

// $.ajax({
//   url: 'https://spreadsheets.google.com/feeds/list/1-v8yqBqu1F_YuKritxFTFN8rPJSJ9KXTAX8SSHf0bcs/ozlx73/public/values?alt=json',
//   dataType: 'jsonp',
//   success: function(data) {
//     console.log(data);
//     console.log(data.feed.entry[10].gsx$iata.$t);
//   }
// });


// $.ajax({
//   url: 'https://s3.amazonaws.com/airportinformation/airports.json',
//   type: 'GET',
//   dataType: 'jsonp',
//   jsonpCallback:'flightData',
//   success: function(data) {
//     alert('worked');
//     console.log(data);
//   }
// });

// var holdData = flightData();

$.goup({
  title: 'back to top',
  containerRadius: 100
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
  $('.factsbtn').css('display','inline-block');
}

$('.factsbtn').click(function() {
  calcDistance();
  decideWhichFacts(distanceTraveled);
  generateStatements(whichFacts);
  $('.facts').removeClass('hide');
  $('.facts').ScrollTo();
  $('.ataglance').slick({
  adaptiveHeight: true,
  dots: true
  });
});

// Spherical law of cosines calculation script from http://www.movable-type.co.uk/scripts/latlong.html

var lat1,lat2,lon1,lon2, distanceTraveled, whichFacts;

function toRadians(coord) {
  return coord * Math.PI/180;
}

function calcDistance() {
  var φ1 = toRadians(lat1), 
      φ2 = toRadians(lat2), 
      Δλ = toRadians(lon2-lon1), 
      R = 3959; // mi

var d = Math.round(Math.acos( Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R);

 distanceTraveled = d;
}

function decideWhichFacts(distance) {
  if(distance <= 500) {
    whichFacts = planeFacts.shortDistance;
  }
  else if(distance >= 3000) {
    whichFacts = planeFacts.longDistance;
  }
  else {
    whichFacts = planeFacts.medDistance;
  }
}

//Fun Fact Statements
function generateStatements(facts) {
    $('.glance.n1').html('<h3 class="facttitle">Total Distance Traveled: <h2 class="factoid">' + distanceTraveled +'</h2><p class="comment">miles</p>');
    $('.glance.n2').html('<h3 class="facttitle">Number of hours in the air: <h2 class="factoid">' + facts.hoursInAir(distanceTraveled) +'</h2><p class="comment">Estimate is based on a non-stop flight, and does not factor in head/tail-winds, multiple boarding and unloading procedures, or how drunk your pilot might be. It is simply how many hours you will be up in the air!</p>');
    $('.glance.n3').html('<h3 class="facttitle">You\'ll fly on a plane similar to: <h2 class="factoid">' + facts.planeType +'</h2><p class="comment">woohoo</p>');

    $('.air.n1').html('<h3 class="facttitle">Cruising Altitude</h3><h2 class="factoid">' + facts.cruisingAlt +'</h2><p class="comment">feet</p>');
    $('.air.n2').html('<h3 class="facttitle">Average Flight Speed</h3><h2 class="factoid">' + facts.avgSpeed +'</h2><p class="comment">miles per hour</p>');

    $('.flight.n1').html('<h3 class="facttitle">There will be around</h3><h2 class="factoid">' + facts.avgPeople +'</h2><p class="comment">people on your flight</p>');
    $('.flight.n2').html('<h3 class="facttitle">Number of Flight Attendants</h3><h2 class="factoid">' + facts.flightAttendants +'</h2><p class="comment">yay</p>');
    $('.flight.n3').html('<h3 class="facttitle">Will a meal be served?</h3><h2 class="factoid">' + facts.meal +'</h2><p class="comment">hmmm</p>');
}

$('.first').click(function () {
  $('.carousel').addClass('hide');
  $('.ataglance').removeClass('hide');
  $('.ataglance').slick({
  adaptiveHeight: true,
  dots: true
  });
});

$('.second').click(function () {
  $('.carousel').addClass('hide');
  $('.intheair').removeClass('hide');
  $('.intheair').slick({
  adaptiveHeight: true,
  dots: true
  });
});

$('.third').click(function () {
  $('.carousel').addClass('hide');
  $('.inyourflight').removeClass('hide');
  $('.inyourflight').slick({
  adaptiveHeight: true,
  dots: true
  });
});

