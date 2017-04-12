'use strict'

var SlackBot = require('slackbots');
var Promise = require('promise');
var util = require('util');
var express = require('express');
var app = express();
console.log(process.env);
var xkcdbot = new SlackBot({
  name: process.env.TOKEN,
  token: process.env.name
});

var params = {
  icon_emoji: ':xkcd:'
};

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

// //uses the request module and http promise module to retrieve the
// //xkcd comic at the url. Returns the JSON comic object.
// function requestComic(url){
//   var promise = new Promise(function (resolve, reject){
//     require('request')(url, function(error, response, body){
//       if(error) reject(error);
//
//       try{
//         console.log(body);
//         var comic = JSON.parse(body);
//
//         resolve(comic);
//       }
//       catch(e){
//         console.log('unable to retrieve comic');
//       }
//     })
//   });
//   return promise;
// }


app.get('/', function(req,res){
  res.send('Slack bot app is running...');
});

app.listen(443,function(){
  console.log('Listing on port 80')
});