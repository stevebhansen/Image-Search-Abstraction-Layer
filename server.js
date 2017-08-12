// server.js
// where your node app starts

// init project
var express = require('express');
var fetch= require("node-fetch")
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/api/imagesearch/*", function (request, response) {
  var search_results;
  var start = request.params[1] ? request.params[1] : 0;
  var search_string = `https://www.googleapis.com/customsearch/v1?key=${process.env.APIID}&cx=${process.env.ENGINE}&q=${request.params[0]}&searchType=image&start=${start}`;
  fetch(search_string,{method: "GET"})
    .then((search_results) => {
        return search_results.json();
    })
    .then((response_data) => {
      return(response_data);
    })
    .then((data)=>{
      var image_data = [];
      for (var i=0;i< data.items.length;i++){
        var temp = {
          "url": data.items[i].link,
          "snippet": data.items[i].snippet,
          "thumbnail": data.items[i].image.thumbnailLink,
          "context": data.items[i].image.contextLink
        };
        image_data.push(temp);
      }
      return image_data;
    })
    .then((links)=>{
      response.send(links);
    })
    .catch(function(err) {
          console.log(err);
    });
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
