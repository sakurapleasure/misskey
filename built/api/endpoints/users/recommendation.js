"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const ms = require('ms');
const cafy_1 = require("cafy");
const user_1 = require("../../models/user");
const user_2 = require("../../serializers/user");
const get_friends_1 = require("../../common/get-friends");
/**
 * Get recommended users
 *
 * @param {any} params
 * @param {any} me
 * @return {Promise<any>}
 */
module.exports = (params, me) => new Promise(async (res, rej) => {
    // Get 'limit' parameter
    const [limit = 10, limitErr] = cafy_1.default(params.limit).optional.number().range(1, 100).$;
    if (limitErr)
        return rej('invalid limit param');
    // Get 'offset' parameter
    const [offset = 0, offsetErr] = cafy_1.default(params.offset).optional.number().min(0).$;
    if (offsetErr)
        return rej('invalid offset param');
    // ID list of the user itself and other users who the user follows
    const followingIds = await get_friends_1.default(me._id);
    const users = await user_1.default
        .find({
        _id: {
            $nin: followingIds
        },
        last_used_at: {
            $gte: new Date(Date.now() - ms('7days'))
        }
    }, {
        limit: limit,
        skip: offset,
        sort: {
            followers_count: -1
        }
    });
    // Serialize
    res(await Promise.all(users.map(async (user) => await user_2.default(user, me, { detail: true }))));
});
