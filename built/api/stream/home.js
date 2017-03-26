"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const post_1 = require("../serializers/post");
const log = debug('misskey');
function homeStream(request, connection, subscriber, user) {
    // Subscribe Home stream channel
    subscriber.subscribe(`misskey:user-stream:${user._id}`);
    subscriber.on('message', async (channel, data) => {
        switch (channel.split(':')[1]) {
            case 'user-stream':
                connection.send(data);
                break;
            case 'post-stream':
                const postId = channel.split(':')[2];
                log(`RECEIVED: ${postId} ${data} by @${user.username}`);
                const post = await post_1.default(postId, user, {
                    detail: true
                });
                connection.send(JSON.stringify({
                    type: 'post-updated',
                    body: {
                        post: post
                    }
                }));
                break;
        }
    });
    connection.on('message', data => {
        const msg = JSON.parse(data.utf8Data);
        switch (msg.type) {
            case 'capture':
                if (!msg.id)
                    return;
                const postId = msg.id;
                log(`CAPTURE: ${postId} by @${user.username}`);
                subscriber.subscribe(`misskey:post-stream:${postId}`);
                break;
        }
    });
}
exports.default = homeStream;
