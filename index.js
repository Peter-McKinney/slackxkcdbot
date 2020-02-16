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

function getReplacePayload(comic) {
  return JSON.stringify({
    response_type: 'in_channel',
    replace_original: true,
    delete_original: true,
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

function getCancelPayload() {
  return JSON.stringify({
    response_type: 'ephemeral',
    delete_original: true
  });
}

function getShufflePayload(comic) {
  return JSON.stringify( {
    reponseType: 'ephemeral',
    replace_original: true,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:  comic.safe_title
        }
      },
      {
        type: 'image',
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
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Cancel this message?'
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Cancel',
            emoji: true
          },
          value: 'cancel'
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Shuffle and find a new comic?'
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Shuffle',
            emoji: true
          },
          value: 'shuffle'
        },
      }
    ]
   })
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
  console.log(req);
  let responseUrl = getResponseUrl(req.body.payload);
  let actionValue = getActionValue(req.body.payload);

  if(actionValue == 'cancel') {
    slackapi.postResponse(responseUrl, getCancelPayload());
    res.status(200).send();
    return;
  }

  if(actionValue == 'shuffle') {
    let comic = await xkcd.getRandomXkcdComic();
    slackapi.postResponse(responseUrl, getShufflePayload(comic));
    res.status(200).send();
    return;
  }

  let comic = await xkcd.getComicById(actionValue);

  let responsePayload = getReplacePayload(comic);

  slackapi.postResponse(responseUrl, responsePayload);

  res.status(200)
    .contentType('application/json')
    .send()
});

app.post('/', urlencodedParser, async (req, res) => {
  let comic;

  if(req.body.text == 'random') {
    comic = await xkcd.getRandomXkcdComic();
  } else {
    comic = await xkcd.getCurrentComic();
  }

  res.status(200)
    .contentType('application/json')
    .send(JSON.stringify({
      response_type: 'ephemeral',
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
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Cancel this message?'
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Cancel',
              emoji: true
            },
            value: 'cancel'
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Shuffle and find a new comic?'
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Shuffle',
              emoji: true
            },
            value: 'shuffle'
          },
        }
      ]
    }));
});

app.listen(port, function () {
  console.log('Listing on port ' + port);
});
