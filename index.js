'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const xkcd = require('./xkcd');
const slackapi = require('./slackapi');

const app = express();

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
let port = process.env.PORT || 3000;

function getActionValue(payload) {
  payload = JSON.parse(payload);
  console.log(payload.actions[0].value);
  return payload.actions[0].value;
}

function getResponseUrl(payload) {
  payload = JSON.parse(payload);
  return payload.response_url;
}

function getResponsePayload(comic) {
  return JSON.stringify({
    response_type: 'in_channel',
    replace_original: true,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: comic.safe_title
        }
      },
      {
        type: "image",
        image_url: comic.img,
        alt_text: comic.alt
      }
    ]
  });
}

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

app.post('/event', jsonParser, (req, res) => {
  let challenge = req.body.challenge;

  res.status(200)
    .contentType('application/json')
    .send({ challenge: challenge });
});

app.post('/postMessage', urlencodedParser, async (req, res) => {
  let actionValue = getActionValue(req.body.payload);
  let comic = await xkcd.getComicById(actionValue);

  let responseUrl = getResponseUrl(req.body.payload);
  let responsePayload = getResponsePayload(comic);

  slackapi.postResponse(responseUrl, responsePayload);

  res.status(200)
    .contentType('application/json')
    .send()
});

app.post('/', jsonParser, async (req, res) => {
  let comic = await xkcd.getCurrentComic();

  res.status(200)
    .contentType('application/json')
    .send(JSON.stringify({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: comic.safe_title
          }
        },
        {
          type: "image",
          image_url: comic.img,
          alt_text: comic.alt
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Would you like to post this comic?'
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Post',
              emoji: true
            },
            value: comic.num.toString()
          }
        }
      ]
    }));
});

app.listen(port, function () {
  console.log('Listing on port ' + port);
});
