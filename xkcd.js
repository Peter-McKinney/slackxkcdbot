const request = require('request');

const xkcdBaseUrl = 'http://xkcd.com/';
const xkcdInfoUrlPart = 'info.0.json';
const infoUrl = `${xkcdBaseUrl}${xkcdInfoUrlPart}`;


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

async function getComicById(comicId) {
    let url = `${xkcdBaseUrl}${comicId}/${xkcdInfoUrlPart}`;

    let comic = await getComic(url);
    return comic;
}

async function getRandomXkcdComic() {
    let currentComic = await getCurrentComic();
    let randomId = getRandomComicId(currentComic.num);
  
    let url = `${xkcdBaseUrl}${randomId}/${xkcdInfoUrlPart}`;
    let comic = await getComic(url);
  
    return comic;
}

module.exports = {
    getCurrentComic,
    getRandomXkcdComic,
    getRandomComicId,
    getComicById
}