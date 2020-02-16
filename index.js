'use strict'

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var request = require('request');

var xkcdBaseUrl = 'http://xkcd.com/';
var infoUrl = xkcdBaseUrl + 'info.0.json';

function generateRandomInteger(max) {
  var id = Math.floor((Math.random() * max) + 1);
  return id;
}

function getRandomComicId(max) {
  let randomId = generateRandomInteger(max);
  
  //http://xkcd.com/404 displays a 404 - Not Found error page
  while(randomId == 404) {
    randomId = generateRandomInteger(max);
  }

  return randomId;
}

function getCurrentComic() {
  return new Promise((resolve, reject) => {
    request(infoUrl, (error, response, body) => {
      try {
        let currentComic = JSON.parse(body);
        resolve(currentComic);
      }
      catch(error) {
        reject(error);
      }
    });
  });
}

function getComic(url) {
  return new Promise((resolve, reject) => {
    request(url,function(error,result,body){
      try {
        let comic = JSON.parse(body);
        resolve(comic);
      }
      catch(e){
        reject(e);
      }
    });
  });
}

async function getRandomXkcdComic() {
  let currentComic = await getCurrentComic();
  let randomId = getRandomComicId(currentComic.num);

  let url = xkcdBaseUrl + randomId + '/info.0.json';
  let comic = await getComic(url);

  return comic;
}

app.get('/json/randomComic', async (req, res) => {
  let comic = await getRandomXkcdComic();

  res.status(200)
    .contentType('application/json')
    .send(JSON.stringify(comic));
});

app.get('/json/currentComic', async(req, res) => {
  let comic = await getCurrentComic();

  res.status(200)
    .contentType('application/json')
    .send(JSON.stringify(comic));
});

app.get('/', function(req,res){
  res.status(200)
    .contentType('application/json')
    .send('Slack bot app is running...');
});

app.post('/event', (req, res) => {
  let challenge = req.body.challenge;

  res.status(200)
    .contentType('text/plain')
    .send(challenge);
});

app.listen(port, function(){
  console.log('Listing on port ' + port);
});