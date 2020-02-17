'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const xkcd = require('./xkcd');
const slackapi = require('./slackapi');
const payload = require('./payload');

const app = express();

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
let port = process.env.PORT || 3000;

app.get('/json/randomComic', async (req, res) => {
  let comic = await xkcd.getRandomXkcdComic();

  res.status(200)
    .contentType('application/json')
    .send(JSON.stringify(comic));
});

app.get('/json/currentComic', async (req, res) => {
  let comic = await xkcd.getCurrentComic();

  res.status(200)
    .contentType('application/json')
    .send(JSON.stringify(comic));
});

app.get('/', function (req, res) {
  res.status(200)
    .contentType('application/json')
    .send('Slack bot app is running...');
});

app.post('/postMessage', urlencodedParser, async (req, res) => {
  let responseUrl = payload.getResponseUrl(req.body.payload);
  let actionValue = payload.getActionValue(req.body.payload);

  if (actionValue === 'cancel') {
    slackapi.postResponse(responseUrl, payload.getCancelPayload());
    res.status(200).send();
    return;
  }

  if (actionValue === 'shuffle') {
    let comic = await xkcd.getRandomXkcdComic();
    slackapi.postResponse(responseUrl, payload.getShufflePayload(comic));
    res.status(200).send();
    return;
  }

  let comic = await xkcd.getComicById(actionValue);

  let responsePayload = payload.getReplacePayload(comic);

  slackapi.postResponse(responseUrl, responsePayload);

  res.status(200)
    .contentType('application/json')
    .send()
});

app.post('/', urlencodedParser, async (req, res) => {
  let comic;

  if (req.body.text === 'random') {
    comic = await xkcd.getRandomXkcdComic();
  } else {
    comic = await xkcd.getCurrentComic();
  }

  res.status(200)
    .contentType('application/json')
    .send(payload.getDefaultPayload(comic));
});

app.listen(port, function () {

});
