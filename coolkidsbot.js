'use strict'

var SlackBot = require('slackbots');
var fs, configurationFile;

configurationFile = 'coolkidsbotinfo.json';
fs = require('fs');

var config = JSON.parse(fs.readFileSync(configurationFile));

var bot = new SlackBot({
  name: config.name,
  token: config.token
});

bot.on('start', function(){
  bot.postMessage("random",
    'I am alive!');
});

bot.on('message', function(message) {
  if(message.text == 'xkcd'){
    var url = 'http://xkcd.com/';
    var infoUrl = url + 'info.0.json';

    require('request')(infoUrl, function(error,response,body){
      try{
        var xkcdInfo = JSON.parse(body);
        var id = Math.floor((Math.random() * xkcdInfo.num) + 1);

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


function requestComic(xkcdbot, message, url){
  require('request')(url,function(error,result,body){
    try{
      console.log(body);
      var comic = JSON.parse(body);

      var params = {
        icon_emoji: ':smiling_imp: '
      };

      xkcdbot.postMessage(message.channel,
        comic.title + '\n' + comic.img,
        params);
    }
    catch(e){
      console.log('unable to send message');
    }
  })
}