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
  else if(message.text != undefined && message.text[0] == '#' && message.text.length > 1){
    var ticket = message.text.substr(1);
    //get the max connectwise ticket number somehow?
    if(!ticket.match(/\b\d{4,5}\b/g) || parseInt(ticket) < 1000){
      cthulhubot.postMessage(message.channel,
        'I require a ticket number with 4 digits or more and 1000 or greater.',
        cwparams);
        return;
    }

    var ticketUrl = util.format(config.cwurl, ticket);

    cthulhubot.postMessage(message.channel,
    ticketUrl,
    cwparams);
  }
});