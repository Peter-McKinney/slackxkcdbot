'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const slackapi = require('./slackapi');

const xkcd = require('./xkcd');

const app = express();
app.use(bodyParser.json());

let port = process.env.PORT || 3000;

app.get('/json/randomComic', async (req, res) => {
  let comic = await xkcd.getRandomXkcdComic();

  res.status(200)
    .contentType('application/json')
    .send(JSON.stringify(comic));
});

app.get('/json/currentComic', async(req, res) => {
  let comic = await xkcd.getCurrentComic();

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
  console.log(req.body, 'request');
  let challenge = req.body.challenge;

  res.status(200)
    .contentType('application/json')
    .send({challenge: challenge});
});

app.post('/', async (req, res) => {
  console.log(req.body);
  let comic = await xkcd.getCurrentComic();

  slackapi.callAPIMethod('chat.postMessage', {
    channel: 'botdev',
    text: comic.img
  });

  res.status(200)
    .contentType('application/json')
    .send(comic.img);
});

app.listen(port, function(){
  console.log('Listing on port ' + port);
});