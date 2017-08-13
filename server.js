//todo return a list of previous search terms/times
//mlab mongodb already created and storing searches

// server.js
// where your node app starts

// init project
var express = require('express');
var fetch= require("node-fetch");
var MongoClient = require('mongodb').MongoClient;
var app = express();

//setup and connect to mlab mongo db
var url = 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + '@ds149700.mlab.com:49700/custom_image_search';
var client = null;

MongoClient.connect(url, function (err, db) {
  if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      client = db;
    }
});

var writedb = function (search_term){
  var collection = client.collection('recent_searches');
  collection.insert(search_term, function(err, data){
      if(err) throw err;
      console.log(JSON.stringify(search_term));
  });
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/api/latest/imagesearch/", function(request, response){
  client.collection("recent_searches").find(function(err,doc){
    if(err) throw err;
    else{
      if(doc != null)
        response.send(typeof doc);
    }
  }).sort({_id:1}).limit(10);
});

app.get("/api/imagesearch/*", function (request, response) {
  var search_results;
  var start = request.query.offset ? request.query.offset : '1';
  var date = new Date();
  var ISO_time = date.toISOString();
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
      writedb({term: request.params[0], when: ISO_time });
      response.send(links);
    })
    .catch(function(err) {
          console.log(err);
    });
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
