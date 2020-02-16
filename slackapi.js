const apiUrl = 'https://slack.com/api';
const request = require('request');
const axios = require('axios');
const queryString = require('querystring');

const config = {
    headers: { Authorization: `Bearer ${process.env.SLACK_TOKEN}`}
};

const callAPIMethod = async (method, payload) => {
    let result = await axios.post(`${apiUrl}/${method}`, payload, config);
    console.log(result, 'slack api result');
    return result.data;
}

const postResponse = async(url, payload) => {
    let result = await axios.post(`${url}`, payload, config);
    console.log(result, 'slack api request_url result');
    return result.data;
}

module.exports = {
    callAPIMethod,
    postResponse
}