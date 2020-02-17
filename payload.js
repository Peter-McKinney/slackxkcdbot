function getActionValue(payload) {
    payload = JSON.parse(payload);
    return payload.actions[0].value;
}

function getResponseUrl(payload) {
    payload = JSON.parse(payload);
    return payload.response_url;
}

function getReplacePayload(comic) {
    return JSON.stringify({
        response_type: 'in_channel',
        replace_original: true,
        delete_original: true,
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: comic.safe_title
                }
            },
            {
                type: 'image',
                image_url: comic.img,
                alt_text: comic.alt
            }
        ]
    });
}

function getCancelPayload() {
    return JSON.stringify({
        response_type: 'ephemeral',
        delete_original: true
    });
}

function getShufflePayload(comic) {
    return JSON.stringify({
        reponseType: 'ephemeral',
        replace_original: true,
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: comic.safe_title
                }
            },
            {
                type: 'image',
                image_url: comic.img,
                alt_text: comic.alt
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'Would you like to post this comic?'
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Post',
                        emoji: true
                    },
                    value: comic.num.toString()
                },
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'Cancel this message?'
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Cancel',
                        emoji: true
                    },
                    value: 'cancel'
                },
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'Shuffle and find a new comic?'
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Shuffle',
                        emoji: true
                    },
                    value: 'shuffle'
                },
            }
        ]
    })
}

function getDefaultPayload(comic) {
    return JSON.stringify({
        response_type: 'ephemeral',
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: comic.safe_title
                }
            },
            {
                type: 'image',
                image_url: comic.img,
                alt_text: comic.alt
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'Would you like to post this comic?'
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Post',
                        emoji: true
                    },
                    value: comic.num.toString()
                },
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'Cancel this message?'
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Cancel',
                        emoji: true
                    },
                    value: 'cancel'
                },
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'Shuffle and find a new comic?'
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Shuffle',
                        emoji: true
                    },
                    value: 'shuffle'
                },
            }
        ]
    });
}

module.exports = {
    getActionValue,
    getCancelPayload,
    getDefaultPayload,
    getShufflePayload,
    getResponseUrl,
    getReplacePayload
};