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

  res.status(200)
    .contentType('application/json')
    .send({
      text: comic.safe_title,
      attachments: [{
        text: comic.alt,
        image_url: comic.img
      }],
      actions: [{
        name: "postMessage",
        text: "Post",
        type: "button",
        value: comic.img
      },
      {
        name: "cancel",
        text: "Cancel",
        type: "button",
        value: "cancel"
      }
    ]
    });
});

app.listen(port, function(){
  console.log('Listing on port ' + port);
});