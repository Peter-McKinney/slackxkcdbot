'use strict'

var snakeparams = {
  icon_emoji: ':snakebot:'
};

var snakebot = new SlackBot({
  name: "snek",
  token: config.snaketoken
});


var SlackBot = require('slackbots');
var Promise = require('promise');
var util = require('util');
var fs, configurationFile;


//snakebot - displays the current snake scores from the snake game api
var snakecommands = ['snakescores','snek','snekscores','ekans', 'arbok'];
//listen for snakescores string and post a message to the channel including the current scores
snakebot.on('message', function(message){
  if(snakecommands.indexOf(message.text) > -1){
    var scoresPromise = requestSnakeScores();
    //resolved promise
    scoresPromise.then(function(scores){
      snakebot.postMessage(message.channel, formatScores(scores) , snakeparams);
    });
  }
  else if(message.text == 'bot roll call'){
    snakebot.postMessage(message.channel, 'I\'m a snek.', snakeparams);
    cthulhubot.postMessage(message.channel, 'Ph\'nglui mglw\'nafh', cthulhuparams);
    xkcdbot.postMessage(message.channel, 'I am alive.',params);
  }
  else if(message.text == 'bot info'){
    snakebot.postMessage(message.channel, 'Commands to show high scores from Eric\'s snake game.\n' + snakecommands
      + '\nTo display the first score use: 1|snake',snakeparams);
    cthulhubot.postMessage(message.channel, 'tableflip, unflip, [argument]++, ?counts\n', cthulhuparams);
    xkcdbot.postMessage(message.channel, 'Type xkcd to display a random comic in a channel.', params);
  }
  else if(message.text != undefined && message.text.match(/^[0-9]+[|](snake)+$/gi)){
    var index = message.text.split('|')[0] - 1;
    var scorePromise = requestSnakeScores();

    //call then method for when promise is resolved
    scorePromise.then(function(scores){
      if(index < scores.length){
        snakebot.postMessage(message.channel, ordinalSuffixOf(index+1) + ' place goes to: *' + scores[index].user + '* with *' + scores[index].value + '* points.', snakeparams);
      }
      else {
        snakebot.postMessage(message.channel, 'No such score exists.', snakeparams);
      }
    });
  }
});

//uses the Promise module to return an http promise. The promise will
//resolve as scores data (assuming no error).
function requestSnakeScores(){
  var promise = new Promise(function (resolve, reject){
    var url = config.snakeurl;
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


//I wish I could use a console table module but slack hated it.
//format the scores in slack with a tabular look.
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

//attach nd, st, rd, th for string formatting
function ordinalSuffixOf(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
