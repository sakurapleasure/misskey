"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const post_1 = require("../../models/post");
const post_2 = require("../../serializers/post");
/**
 * Show a context of a post
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
    // Lookup post
    const post = await post_1.default.findOne({
        _id: postId
    });
    if (post === null) {
        return rej('post not found');
    }
    const context = [];
    let i = 0;
    async function get(id) {
        i++;
        const p = await post_1.default.findOne({ _id: id });
        if (i > offset) {
            context.push(p);
        }
        if (context.length == limit) {
            return;
        }
        if (p.reply_to_id) {
            await get(p.reply_to_id);
        }
    }
    if (post.reply_to_id) {
        await get(post.reply_to_id);
    }
    // Serialize
    res(await Promise.all(context.map(async (post) => await post_2.default(post, user))));
});
