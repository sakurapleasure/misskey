"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const post_1 = require("../../models/post");
const user_1 = require("../../models/user");
const post_2 = require("../../serializers/post");
/**
 * Get posts of a user
 *
 * @param {any} params
 * @param {any} me
 * @return {Promise<any>}
 */
module.exports = (params, me) => new Promise(async (res, rej) => {
    // Get 'user_id' parameter
    const [userId, userIdErr] = cafy_1.default(params.user_id).optional.id().$;
    if (userIdErr)
        return rej('invalid user_id param');
    // Get 'username' parameter
    const [username, usernameErr] = cafy_1.default(params.username).optional.string().$;
    if (usernameErr)
        return rej('invalid username param');
    if (userId === undefined && username === undefined) {
        return rej('user_id or username is required');
    }
    // Get 'include_replies' parameter
    const [includeReplies = true, includeRepliesErr] = cafy_1.default(params.include_replies).optional.boolean().$;
    if (includeRepliesErr)
        return rej('invalid include_replies param');
    // Get 'with_media' parameter
    const [withMedia = false, withMediaErr] = cafy_1.default(params.with_media).optional.boolean().$;
    if (withMediaErr)
        return rej('invalid with_media param');
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
    const q = userId !== undefined
        ? { _id: userId }
        : { username_lower: username.toLowerCase() };
    // Lookup user
    const user = await user_1.default.findOne(q, {
        fields: {
            _id: true
        }
    });
    if (user === null) {
        return rej('user not found');
    }
    // Construct query
    const sort = {
        _id: -1
    };
    const query = {
        user_id: user._id
    };
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
    if (!includeReplies) {
        query.reply_to_id = null;
    }
    if (withMedia) {
        query.media_ids = {
            $exists: true,
            $ne: null
        };
    }
    // Issue query
    const posts = await post_1.default
        .find(query, {
        limit: limit,
        sort: sort
    });
    // Serialize
    res(await Promise.all(posts.map(async (post) => await post_2.default(post, me))));
});
