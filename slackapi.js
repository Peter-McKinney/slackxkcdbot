const apiUrl = 'https://slack.com/api';
const request = require('request');
const axios = require('axios');
const queryString = require('querystring');

const callAPIMethod = async (method, payload) => {
    let data = Object.assign({token: process.env.SLACK_TOKEN}, payload);
    let result = await axios.post(`${apiUrl}/${method}`, queryString.stringify(data));
}

module.exports = {
    callAPIMethod
}