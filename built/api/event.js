"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
const conf_1 = require("../conf");
class MisskeyEvent {
    constructor() {
        // Connect to Redis
        this.redisClient = redis.createClient(conf_1.default.redis.port, conf_1.default.redis.host);
    }
    publish(channel, type, value) {
        const message = value == null ?
            { type: type } :
            { type: type, body: value };
        this.redisClient.publish(`misskey:${channel}`, JSON.stringify(message));
    }
    publishUserStream(userId, type, value) {
        this.publish(`user-stream:${userId}`, type, typeof value === 'undefined' ? null : value);
    }
    publishPostStream(postId, type, value) {
        this.publish(`post-stream:${postId}`, type, typeof value === 'undefined' ? null : value);
    }
    publishMessagingStream(userId, otherpartyId, type, value) {
        this.publish(`messaging-stream:${userId}-${otherpartyId}`, type, typeof value === 'undefined' ? null : value);
    }
}
const ev = new MisskeyEvent();
exports.default = ev.publishUserStream.bind(ev);
exports.publishPostStream = ev.publishPostStream.bind(ev);
exports.publishMessagingStream = ev.publishMessagingStream.bind(ev);
