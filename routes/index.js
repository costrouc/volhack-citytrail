var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

var player = {
  'name': "",
  'health': 0,
  'inventory': [],
  'location': {
    'lat': 0,
    'long': 0
  },
  'movePoints': 0,
}

function getArcGisToken() {
  // var url = "https://www.arcgis.com/sharing/generateToken?username=broabect&password=Volhacks2016&referer=http://localhost/citytrails&expiration=15&f=json";
  // //Lets try to make a HTTP GET request to modulus.io's website.
  // request(url, function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       console.log(typeof(JSON.parse(body).token));
  //       return JSON.parse(body).token;
  //     }
  // });

  var token = "Q6FpZirGt-tRnxw13UKKK13kCa9g-8BlFwCVb5z15j-Xhb6rVTH92j3T1Q_keblqoC7B38X0wg5pIPV6PJhSHQr0nISoPVNhMedX7tM-Y0P1ckSyPvACzKj8J8Do7ONifGbb5ajKm0_egbrAQ1sAxQ..";

  return token;
}

function getApiResponse(url) {
  var token = getArcGisToken();
  url += "&token=" + token;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body); // Show the HTML for the Modulus homepage.
    }
  });
}

getApiResponse("http://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/GeoEnrichment/enrich?studyareas=[{%22geometry%22:{%22x%22:-117.1956,%22y%22:34.0572}}]&f=pjson");

function initPlayer(name) {
  //Default Values
  dHealth = 100;
  dMovePoints = 50;

  player['name'] = name;
  player['health'] = dHealth;
  player['movePoints'] = dMovePoints;

  return player;
}

module.exports = router;
