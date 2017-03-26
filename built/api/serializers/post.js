"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const mongo = require("mongodb");
const deepcopy = require("deepcopy");
const post_1 = require("../models/post");
const post_reaction_1 = require("../models/post-reaction");
const poll_vote_1 = require("../models/poll-vote");
const app_1 = require("./app");
const user_1 = require("./user");
const drive_file_1 = require("./drive-file");
const text_1 = require("../common/text");
/**
 * Serialize a post
 *
 * @param {any} post
 * @param {any} me?
 * @param {any} options?
 * @return {Promise<any>}
 */
const self = (post, me, options) => new Promise(async (resolve, reject) => {
    const opts = options || {
        detail: true,
    };
    let _post;
    // Populate the post if 'post' is ID
    if (mongo.ObjectID.prototype.isPrototypeOf(post)) {
        _post = await post_1.default.findOne({
            _id: post
        });
    }
    else if (typeof post === 'string') {
        _post = await post_1.default.findOne({
            _id: new mongo.ObjectID(post)
        });
    }
    else {
        _post = deepcopy(post);
    }
    const id = _post._id;
    // Rename _id to id
    _post.id = _post._id;
    delete _post._id;
    delete _post.mentions;
    // Parse text
    if (_post.text) {
        _post.ast = text_1.default(_post.text);
    }
    // Populate user
    _post.user = await user_1.default(_post.user_id, me);
    // Populate app
    if (_post.app_id) {
        _post.app = await app_1.default(_post.app_id);
    }
    if (_post.media_ids) {
        // Populate media
        _post.media = await Promise.all(_post.media_ids.map(async (fileId) => await drive_file_1.default(fileId)));
    }
    if (_post.reply_to_id && opts.detail) {
        // Populate reply to post
        _post.reply_to = await self(_post.reply_to_id, me, {
            detail: false
        });
    }
    if (_post.repost_id && opts.detail) {
        // Populate repost
        _post.repost = await self(_post.repost_id, me, {
            detail: _post.text == null
        });
    }
    // Poll
    if (me && _post.poll && opts.detail) {
        const vote = await poll_vote_1.default
            .findOne({
            user_id: me._id,
            post_id: id
        });
        if (vote != null) {
            _post.poll.choices.filter(c => c.id == vote.choice)[0].is_voted = true;
        }
    }
    // Fetch my reaction
    if (me && opts.detail) {
        const reaction = await post_reaction_1.default
            .findOne({
            user_id: me._id,
            post_id: id,
            deleted_at: { $exists: false }
        });
        if (reaction) {
            _post.my_reaction = reaction.reaction;
        }
    }
    resolve(_post);
});
exports.default = self;
