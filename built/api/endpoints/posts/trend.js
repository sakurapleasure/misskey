"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const ms = require('ms');
const cafy_1 = require("cafy");
const post_1 = require("../../models/post");
const post_2 = require("../../serializers/post");
/**
 * Get trend posts
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Get 'limit' parameter
    const [limit = 10, limitErr] = cafy_1.default(params.limit).optional.number().range(1, 100).$;
    if (limitErr)
        return rej('invalid limit param');
    // Get 'offset' parameter
    const [offset = 0, offsetErr] = cafy_1.default(params.offset).optional.number().min(0).$;
    if (offsetErr)
        return rej('invalid offset param');
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
    const query = {
        created_at: {
            $gte: new Date(Date.now() - ms('1days'))
        },
        repost_count: {
            $gt: 0
        }
    };
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
        skip: offset,
        sort: {
            repost_count: -1,
            _id: -1
        }
    });
    // Serialize
    res(await Promise.all(posts.map(async (post) => await post_2.default(post, user, { detail: true }))));
});
