# slackxkcdbot
A simple slack bot that posts a random xkcd comic to a slack channel. This uses the slackbots project located here: https://github.com/mishk0/slack-bot-api

# Usage
We must have a file named xkcdinfo.json which contains the following information:

```json
{
  "name": "botname",
  "token" : "bottoken",
  "devchannel" : "name of channel for dev testing" 
}
```

I am using a custom :xkcd: emoji. We will have to either create a custom emoji, edit the params to use an existing default slack emoji, or remove the params var. 

```javascript
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

```
