// server.js
// where your node app starts

// init project
var express = require('express');
var fetchUrl = require("fetch").fetchUrl;
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dreams", function (request, response) {
  /*fetchUrl('https://www.googleapis.com/customsearch/v1?key=' + process.env.APIID + '&cx='+process.env.ENGINE +'&q=lectures')
    .then(function(searchData) {
      response.send(searchData);
  }).catch(function(err) {
    console.log('bummer');
    //console.log(err);
  });*/
  response.send('hello steve, nice try');
});


// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
