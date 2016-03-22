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

xkcdbot.postMessage(message.channel,
  comic.title + '\n' + comic.img,
  params); //remove the params argument if we are not using an emoji.

```
