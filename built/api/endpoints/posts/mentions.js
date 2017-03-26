"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const post_1 = require("../../models/post");
const get_friends_1 = require("../../common/get-friends");
const post_2 = require("../../serializers/post");
/**
 * Get mentions of myself
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Get 'following' parameter
    const [following = false, followingError] = cafy_1.default(params.following).optional.boolean().$;
    if (followingError)
        return rej('invalid following param');
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
    const query = {
        mentions: user._id
    };
    const sort = {
        _id: -1
    };
    if (following) {
        const followingIds = await get_friends_1.default(user._id);
        query.user_id = {
            $in: followingIds
        };
    }
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
    // Issue query
    const mentions = await post_1.default
        .find(query, {
        limit: limit,
        sort: sort
    });
    // Serialize
    res(await Promise.all(mentions.map(async (mention) => await post_2.default(mention, user))));
});
