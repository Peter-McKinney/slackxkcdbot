let request = require('request');

let xkcdBaseUrl = 'http://xkcd.com/';
let infoUrl = `${xkcdBaseUrl}info.0.json`;

function generateRandomInteger(max) {
  var id = Math.floor((Math.random() * max) + 1);
  return id;
}

function getRandomComicId(max) {
  let randomId = generateRandomInteger(max);
  
  //http://xkcd.com/404 displays a 404 - Not Found error page
  while(randomId == 404) {
    randomId = generateRandomInteger(max);
  }

  return randomId;
}

function getCurrentComic() {
  return new Promise((resolve, reject) => {
    request(infoUrl, (error, response, body) => {
      try {
        let currentComic = JSON.parse(body);
        resolve(currentComic);
      }
      catch(error) {
        reject(error);
      }
    });
  });
}

async function getRandomXkcdComic() {
    let currentComic = await getCurrentComic();
    let randomId = getRandomComicId(currentComic.num);
  
    let url = `${xkcdBaseUrl}${randomId}/info.0.json`;
    let comic = await getComic(url);
  
    return comic;
  }

function getComic(url) {
  return new Promise((resolve, reject) => {
    request(url,function(error,result,body){
      try {
        let comic = JSON.parse(body);
        resolve(comic);
      }
      catch(e){
        reject(e);
      }
    });
  });
}

module.exports = {
    getCurrentComic,
    getRandomXkcdComic,
    getRandomComicId
}