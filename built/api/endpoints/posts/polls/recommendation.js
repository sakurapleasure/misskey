"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const poll_vote_1 = require("../../../models/poll-vote");
const post_1 = require("../../../models/post");
const post_2 = require("../../../serializers/post");
/**
 * Get recommended polls
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
    // Get votes
    const votes = await poll_vote_1.default.find({
        user_id: user._id
    }, {
        fields: {
            _id: false,
            post_id: true
        }
    });
    const nin = votes && votes.length != 0 ? votes.map(v => v.post_id) : [];
    const posts = await post_1.default
        .find({
        _id: {
            $nin: nin
        },
        user_id: {
            $ne: user._id
        },
        poll: {
            $exists: true,
            $ne: null
        }
    }, {
        limit: limit,
        skip: offset,
        sort: {
            _id: -1
        }
    });
    // Serialize
    res(await Promise.all(posts.map(async (post) => await post_2.default(post, user, { detail: true }))));
});
