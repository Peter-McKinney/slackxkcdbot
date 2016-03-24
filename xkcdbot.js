'use strict'

var SlackBot = require('slackbots');
var fs, configurationFile;

configurationFile = 'xkcdinfo.json';
fs = require('fs');

var params = {
  icon_emoji: ':xkcd:'
};

var config = JSON.parse(fs.readFileSync(configurationFile));

var bot = new SlackBot({
  name: config.name,
  token: config.token
});

var snakebot = new SlackBot({
  name: "snek",
  token: config.snaketoken
});


var snakecommands = ['snakescores','snek','snekscores','ekan', 'arbok'];
//listen for snakescores string and post a message to the channel including the current scores
//retrieve from http://psm-snakescores.rhcloud.com/scores
snakebot.on('message', function(message){
  if(snakecommands.indexOf(message.text) > -1){
    var url = 'http://psm-snakescores.rhcloud.com/scores';

    require('request')(url, function(error, response, body){
      try{
        var scores = JSON.parse(body);
        var snakeparams = {
          icon_emoji: ':snakebot:'
        };

        snakebot.postMessage(message.channel, formatScores(scores) , snakeparams);
      }
      catch(e){
        console.log(e);
      }
    });
  }
});

//post a message on start to a channel defined as the devchannel.
// bot.on('start', function(){
//   bot.postMessage(config.devchannel,
//     'I am alive!',
//     params);
// });

bot.on('message', function(message) {
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
        requestComic(bot,message,url);
      }
      catch(e){
        console.log(e);
      }
    });
  }
});

//I wish I could use a console table module but slack hated it.
//formats the scores in with a tabular look.
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
  })
}