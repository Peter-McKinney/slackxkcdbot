'use strict'

var SlackBot = require('slackbots');
var fs, configurationFile;

configurationFile = 'cthulhuinfo.json';
fs = require('fs');

var config = JSON.parse(fs.readFileSync(configurationFile));

var cthulhu = new SlackBot({
  name: config.name,
  token: config.token
});

var params = {
  icon_emoji: ':cthulhu:'
};

cthulhu.on('start', function(){
  cthulhu.postMessage(config.devchannel,
    'Ph\'nglui mglw\'nafh',
    params);
});

cthulhu.on('message', function(message){
  var params = {
    icon_emoji: ':cthulhu:'
  };

  if(message.text == 'tableflip'){
    cthulhu.postMessage(message.channel,
      '(╯°□°)╯︵ ┻━┻',
      params);
  }
  else if(message.text == 'unflip'){
    cthulhu.postMessage(message.channel,
      '┬─┬﻿ ノ( ゜-゜ノ)',
      params);
  }
});