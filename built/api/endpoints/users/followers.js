"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const user_1 = require("../../models/user");
const following_1 = require("../../models/following");
const user_2 = require("../../serializers/user");
const get_friends_1 = require("../../common/get-friends");
/**
 * Get followers of a user
 *
 * @param {any} params
 * @param {any} me
 * @return {Promise<any>}
 */
module.exports = (params, me) => new Promise(async (res, rej) => {
    // Get 'user_id' parameter
    const [userId, userIdErr] = cafy_1.default(params.user_id).id().$;
    if (userIdErr)
        return rej('invalid user_id param');
    // Get 'iknow' parameter
    const [iknow = false, iknowErr] = cafy_1.default(params.iknow).optional.boolean().$;
    if (iknowErr)
        return rej('invalid iknow param');
    // Get 'limit' parameter
    const [limit = 10, limitErr] = cafy_1.default(params.limit).optional.number().range(1, 100).$;
    if (limitErr)
        return rej('invalid limit param');
    // Get 'cursor' parameter
    const [cursor = null, cursorErr] = cafy_1.default(params.cursor).optional.id().$;
    if (cursorErr)
        return rej('invalid cursor param');
    // Lookup user
    const user = await user_1.default.findOne({
        _id: userId
    }, {
        fields: {
            _id: true
        }
    });
    if (user === null) {
        return rej('user not found');
    }
    // Construct query
    const query = {
        followee_id: user._id,
        deleted_at: { $exists: false }
    };
    // ログインしていてかつ iknow フラグがあるとき
    if (me && iknow) {
        // Get my friends
        const myFriends = await get_friends_1.default(me._id);
        query.follower_id = {
            $in: myFriends
        };
    }
    // カーソルが指定されている場合
    if (cursor) {
        query._id = {
            $lt: cursor
        };
    }
    // Get followers
    const following = await following_1.default
        .find(query, {
        limit: limit + 1,
        sort: { _id: -1 }
    });
    // 「次のページ」があるかどうか
    const inStock = following.length === limit + 1;
    if (inStock) {
        following.pop();
    }
    // Serialize
    const users = await Promise.all(following.map(async (f) => await user_2.default(f.follower_id, me, { detail: true })));
    // Response
    res({
        users: users,
        next: inStock ? following[following.length - 1]._id : null,
    });
});
