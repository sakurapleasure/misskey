"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const user_1 = require("../../models/user");
const following_1 = require("../../models/following");
const event_1 = require("../../event");
const user_2 = require("../../serializers/user");
/**
 * Unfollow a user
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    const follower = user;
    // Get 'user_id' parameter
    const [userId, userIdErr] = cafy_1.default(params.user_id).id().$;
    if (userIdErr)
        return rej('invalid user_id param');
    // Check if the followee is yourself
    if (user._id.equals(userId)) {
        return rej('followee is yourself');
    }
    // Get followee
    const followee = await user_1.default.findOne({
        _id: userId
    }, {
        fields: {
            data: false,
            profile: false
        }
    });
    if (followee === null) {
        return rej('user not found');
    }
    // Check not following
    const exist = await following_1.default.findOne({
        follower_id: follower._id,
        followee_id: followee._id,
        deleted_at: { $exists: false }
    });
    if (exist === null) {
        return rej('already not following');
    }
    // Delete following
    await following_1.default.update({
        _id: exist._id
    }, {
        $set: {
            deleted_at: new Date()
        }
    });
    // Send response
    res();
    // Decrement following count
    user_1.default.update({ _id: follower._id }, {
        $inc: {
            following_count: -1
        }
    });
    // Decrement followers count
    user_1.default.update({ _id: followee._id }, {
        $inc: {
            followers_count: -1
        }
    });
    // Publish follow event
    event_1.default(follower._id, 'unfollow', await user_2.default(followee, follower));
});
