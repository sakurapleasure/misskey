"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const post_1 = require("../../models/post");
const post_reaction_1 = require("../../models/post-reaction");
const post_reaction_2 = require("../../serializers/post-reaction");
/**
 * Show reactions of a post
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Get 'post_id' parameter
    const [postId, postIdErr] = cafy_1.default(params.post_id).id().$;
    if (postIdErr)
        return rej('invalid post_id param');
    // Get 'limit' parameter
    const [limit = 10, limitErr] = cafy_1.default(params.limit).optional.number().range(1, 100).$;
    if (limitErr)
        return rej('invalid limit param');
    // Get 'offset' parameter
    const [offset = 0, offsetErr] = cafy_1.default(params.offset).optional.number().min(0).$;
    if (offsetErr)
        return rej('invalid offset param');
    // Get 'sort' parameter
    const [sort = 'desc', sortError] = cafy_1.default(params.sort).optional.string().or('desc asc').$;
    if (sortError)
        return rej('invalid sort param');
    // Lookup post
    const post = await post_1.default.findOne({
        _id: postId
    });
    if (post === null) {
        return rej('post not found');
    }
    // Issue query
    const reactions = await post_reaction_1.default
        .find({
        post_id: post._id,
        deleted_at: { $exists: false }
    }, {
        limit: limit,
        skip: offset,
        sort: {
            _id: sort == 'asc' ? 1 : -1
        }
    });
    // Serialize
    res(await Promise.all(reactions.map(async (reaction) => await post_reaction_2.default(reaction, user))));
});
