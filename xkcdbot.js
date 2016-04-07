'use strict'

var SlackBot = require('slackbots');
var Promise = require('promise');
var fs, configurationFile;

configurationFile = 'xkcdinfo.json';
fs = require('fs');

var config = JSON.parse(fs.readFileSync(configurationFile));

var xkcdbot = new SlackBot({
  name: config.name,
  token: config.token
});

var snakebot = new SlackBot({
  name: "snek",
  token: config.snaketoken
});

var cthulhubot = new SlackBot({
  name: "cthulhu",
  token: config.cthulhutoken
});

var cthulhuparams = {
  icon_emoji: ':cthulhu:'
};

var snakeparams = {
  icon_emoji: ':snakebot:'
};

var params = {
  icon_emoji: ':xkcd:'
};

//snakebot - displays the current snake scores from the snake game api
var snakecommands = ['snakescores','snek','snekscores','ekan', 'arbok'];
//listen for snakescores string and post a message to the channel including the current scores
//retrieve from http://psm-snakescores.rhcloud.com/scores
snakebot.on('message', function(message){
  if(snakecommands.indexOf(message.text) > -1){
    var url = 'http://psm-snakescores.rhcloud.com/scores';

    require('request')(url, function(error, response, body){
      try{
        var scores = JSON.parse(body);

        snakebot.postMessage(message.channel, formatScores(scores) , snakeparams);
      }
      catch(e){
        console.log(e);
      }
    });
  }
  else if(message.text == 'bot roll call'){
    snakebot.postMessage(message.channel, 'I\'m a snek.', snakeparams);
    cthulhubot.postMessage(message.channel, 'Ph\'nglui mglw\'nafh', cthulhuparams);
    xkcdbot.postMessage(message.channel, 'I am alive.',params);
  }
  else if(message.text == 'bot info'){
    snakebot.postMessage(message.channel, 'Commands to show high scores from Eric\'s snake game.\n' + snakecommands
      + '\nTo display the first score use: number1snake',snakeparams);
    cthulhubot.postMessage(message.channel, 'tableflip, unflip, [argument]++, ?counts\n', cthulhuparams);
    xkcdbot.postMessage(message.channel, 'Type xkcd to display a random comic in a channel.', params);
  }
  else if(message.text == 'number1snake'){
    var scorePromise = requestSnakeScores();
    //call then method for when promise is resolved
    scorePromise.then(function(scores){
      snakebot.postMessage(message.channel, 'First Place goes to: *' + scores[0].user + '* with *' + scores[0].value + '* points.', snakeparams);
    });
  }
});

//cthulhu - various joke commands and the ever broken 'counts' command.
var countTopics = [];
//listen for cthulhu commands
cthulhubot.on('message', function(message){

  if(message.text == 'tableflip'){
    cthulhubot.postMessage(message.channel,
      '(╯°□°)╯︵ ┻━┻',
      cthulhuparams);
  }
  else if(message.text == 'unflip'){
    cthulhubot.postMessage(message.channel,
      '┬─┬﻿ ノ( ゜-゜ノ)',
      cthulhuparams);
  }
  else if(message.text != undefined && message.text.slice(-2) == '++'){
    var seen = false;
    var score = 1;
    var topic = message.text.slice(0, message.text.length - 2).toUpperCase();

    for(var i = 0; i < countTopics.length; i++){
      if(countTopics[i].name == topic){
        score = ++countTopics[i].count;
        seen = true;
        break;
      }
    }

    if(seen == false){
      countTopics.push({name: topic, count: 1});
    }

    cthulhubot.postMessage(message.channel,
      'The current score for *_' + topic.toUpperCase() + '_* is ' + score,
      cthulhuparams);
  }
  else if(message.text != undefined && message.text.indexOf('?counts') > -1){
    var formattedCounts = '';
    for(var i = 0; i < countTopics.length; i++){
      formattedCounts += countTopics[i].name + ' | ' + countTopics[i].count + '\n';
    }

    cthulhubot.postMessage(message.channel,
      formattedCounts,
      cthulhuparams);
  }
  else if(message.text != undefined && message.text == '!clear'){
    countTopics = [];
  }
});

//xkcdbot - returns a random xkcd comic.
//listen for xkcd command in any channel that the bot has been invited to.
xkcdbot.on('message', function(message) {
  if(message.text == 'xkcd'){
    var url = 'http://xkcd.com/';
    var infoUrl = url + 'info.0.json';

    require('request')(infoUrl, function(error,response,body){
      try{
        var xkcdInfo = JSON.parse(body);
        var id = Math.floor((Math.random() * xkcdInfo.num) + 1);

        //http://xkcd.com/404 displays a 404 - Not Found error page
        while(id == 404){
          id = Math.floor((Math.random() * xkcdInfo.num) + 1);
        }

        url += id + '/info.0.json';
        requestComic(xkcdbot,message,url);
      }
      catch(e){
        console.log(e);
      }
    });
  }
});

//I wish I could use a console table module but slack hated it.
//formats the scores in slack with a tabular look.
function formatScores(scores){
  if(scores == undefined || scores.length == 0){
    throw "unable to format scores";
  }
  var formattedScores = '';

  for(var i = 0; i < scores.length; i++){
    var separator = (i+1) >= 10 ? ' ' : '  ';
    formattedScores += '`' + (i+1) + '.' + separator + scores[i].user + ' ' + scores[i].value + '`\n';
  }

  return formattedScores;
}

//uses the request module to get the json for the comic at the url
//and uses the xkcdbot to post a message to the channel where the
//message was received from.
function requestComic(xkcdbot, message, url){
  require('request')(url,function(error,result,body){
    try{
      console.log(body);
      var comic = JSON.parse(body);

      xkcdbot.postMessage(message.channel,
        comic.title + '\n' + comic.img,
        params);
    }
    catch(e){
      console.log('unable to send message');
    }
  });
}

//uses the Promise module to return an http promise. The promise will
//resolve as scores data (assuming no error).
function requestSnakeScores(){
  var promise = new Promise(function (resolve, reject){
    var url = 'http://psm-snakescores.rhcloud.com/scores';

    require('request')(url, function(error, response, body){
      if(error) reject(error);

      try{
        var scores = JSON.parse(body);
        console.log(scores);
        //resolve the promise as scores data
        resolve(scores);
      }
      catch(e){
        console.log(e);
      }
    });
  });
  //return the promise
  return promise;
}
