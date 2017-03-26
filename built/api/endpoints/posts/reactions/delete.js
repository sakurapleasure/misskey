"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const post_reaction_1 = require("../../../models/post-reaction");
const post_1 = require("../../../models/post");
// import event from '../../../event';
/**
 * Unreact to a post
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
    // Fetch unreactee
    const post = await post_1.default.findOne({
        _id: postId
    });
    if (post === null) {
        return rej('post not found');
    }
    // if already unreacted
    const exist = await post_reaction_1.default.findOne({
        post_id: post._id,
        user_id: user._id,
        deleted_at: { $exists: false }
    });
    if (exist === null) {
        return rej('never reacted');
    }
    // Delete reaction
    await post_reaction_1.default.update({
        _id: exist._id
    }, {
        $set: {
            deleted_at: new Date()
        }
    });
    // Send response
    res();
    const dec = {};
    dec['reaction_counts.' + exist.reaction] = -1;
    // Decrement reactions count
    post_1.default.update({ _id: post._id }, {
        $inc: dec
    });
});
