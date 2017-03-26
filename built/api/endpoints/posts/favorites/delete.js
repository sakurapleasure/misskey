"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const favorite_1 = require("../../../models/favorite");
const post_1 = require("../../../models/post");
/**
 * Unfavorite a post
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
    // Get favoritee
    const post = await post_1.default.findOne({
        _id: postId
    });
    if (post === null) {
        return rej('post not found');
    }
    // if already favorited
    const exist = await favorite_1.default.findOne({
        post_id: post._id,
        user_id: user._id
    });
    if (exist === null) {
        return rej('already not favorited');
    }
    // Delete favorite
    await favorite_1.default.deleteOne({
        _id: exist._id
    });
    // Send response
    res();
});
