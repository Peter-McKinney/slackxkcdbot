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
  let challenge = req.body.challenge;

  res.status(200)
    .contentType('application/json')
    .send({challenge: challenge});
});

app.post('/', async (req, res) => {
  if(req.body.type == "interactive_message") {
    postMessageToChannel(req.body);
    res.status(200);
    return;
  }

  let comic = await xkcd.getCurrentComic();

  res.status(200)
    .contentType('application/json')
    .send({
      text: comic.safe_title,
      attachments: [{
        text: comic.alt,
        callback_id: comic.num,
        image_url: comic.img,
      },
      {
        text: "Post this comic?",
        actions: [{
          name: "postMessage",
          text: "Post",
          type: "button",
          value: comic.num
        }]
      }],
    });
});

app.listen(port, function(){
  console.log('Listing on port ' + port);
});

async function postMessageToChannel(body) {
  let actionValue = body.actions[0].value;
  let comic = await xkcd.getComicById(actionValue);

  slackapi.callAPIMethod('chat.postMessage', {
    channel: 'botdev',
    text: comic.safe_title,
    attachments: [{
      text: comic.alt,
      callback_id: comic.num,
      image_url: comic.img
    }]
  });
}