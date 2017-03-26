"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const post_1 = require("../models/post");
const post_2 = require("../serializers/post");
/**
 * Lists all posts
 *
 * @param {any} params
 * @return {Promise<any>}
 */
module.exports = (params) => new Promise(async (res, rej) => {
    // Get 'reply' parameter
    const [reply, replyErr] = cafy_1.default(params.reply).optional.boolean().$;
    if (replyErr)
        return rej('invalid reply param');
    // Get 'repost' parameter
    const [repost, repostErr] = cafy_1.default(params.repost).optional.boolean().$;
    if (repostErr)
        return rej('invalid repost param');
    // Get 'media' parameter
    const [media, mediaErr] = cafy_1.default(params.media).optional.boolean().$;
    if (mediaErr)
        return rej('invalid media param');
    // Get 'poll' parameter
    const [poll, pollErr] = cafy_1.default(params.poll).optional.boolean().$;
    if (pollErr)
        return rej('invalid poll param');
    // Get 'limit' parameter
    const [limit = 10, limitErr] = cafy_1.default(params.limit).optional.number().range(1, 100).$;
    if (limitErr)
        return rej('invalid limit param');
    // Get 'since_id' parameter
    const [sinceId, sinceIdErr] = cafy_1.default(params.since_id).optional.id().$;
    if (sinceIdErr)
        return rej('invalid since_id param');
    // Get 'max_id' parameter
    const [maxId, maxIdErr] = cafy_1.default(params.max_id).optional.id().$;
    if (maxIdErr)
        return rej('invalid max_id param');
    // Check if both of since_id and max_id is specified
    if (sinceId && maxId) {
        return rej('cannot set since_id and max_id');
    }
    // Construct query
    const sort = {
        _id: -1
    };
    const query = {};
    if (sinceId) {
        sort._id = 1;
        query._id = {
            $gt: sinceId
        };
    }
    else if (maxId) {
        query._id = {
            $lt: maxId
        };
    }
    if (reply != undefined) {
        query.reply_to_id = reply ? { $exists: true, $ne: null } : null;
    }
    if (repost != undefined) {
        query.repost_id = repost ? { $exists: true, $ne: null } : null;
    }
    if (media != undefined) {
        query.media_ids = media ? { $exists: true, $ne: null } : null;
    }
    if (poll != undefined) {
        query.poll = poll ? { $exists: true, $ne: null } : null;
    }
    // Issue query
    const posts = await post_1.default
        .find(query, {
        limit: limit,
        sort: sort
    });
    // Serialize
    res(await Promise.all(posts.map(async (post) => await post_2.default(post))));
});
