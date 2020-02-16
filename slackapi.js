const apiUrl = 'https://slack.com/api';
const axios = require('axios');

const config = {
    headers: { Authorization: `Bearer ${process.env.SLACK_TOKEN}` }
};

const callAPIMethod = async (method, payload) => {
    let result = await axios.post(`${apiUrl}/${method}`, payload, config);
    return result.data;
}

const postResponse = async (url, payload) => {
    let result = await axios.post(`${url}`, payload, config);
    return result.data;
}

module.exports = {
    callAPIMethod,
    postResponse
}