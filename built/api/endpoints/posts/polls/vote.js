"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const poll_vote_1 = require("../../../models/poll-vote");
const post_1 = require("../../../models/post");
const notify_1 = require("../../../common/notify");
const event_1 = require("../../../event");
/**
 * Vote poll of a post
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
    // Get votee
    const post = await post_1.default.findOne({
        _id: postId
    });
    if (post === null) {
        return rej('post not found');
    }
    if (post.poll == null) {
        return rej('poll not found');
    }
    // Get 'choice' parameter
    const [choice, choiceError] = cafy_1.default(params.choice).number()
        .pipe(c => post.poll.choices.some(x => x.id == c))
        .$;
    if (choiceError)
        return rej('invalid choice param');
    // if already voted
    const exist = await poll_vote_1.default.findOne({
        post_id: post._id,
        user_id: user._id
    });
    if (exist !== null) {
        return rej('already voted');
    }
    // Create vote
    await poll_vote_1.default.insert({
        created_at: new Date(),
        post_id: post._id,
        user_id: user._id,
        choice: choice
    });
    // Send response
    res();
    const inc = {};
    inc[`poll.choices.${findWithAttr(post.poll.choices, 'id', choice)}.votes`] = 1;
    // Increment votes count
    await post_1.default.update({ _id: post._id }, {
        $inc: inc
    });
    event_1.publishPostStream(post._id, 'poll_voted');
    // Notify
    notify_1.default(post.user_id, user._id, 'poll_vote', {
        post_id: post._id,
        choice: choice
    });
});
function findWithAttr(array, attr, value) {
    for (let i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}
