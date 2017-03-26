"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const deepEqual = require("deep-equal");
const text_1 = require("../../common/text");
const post_1 = require("../../models/post");
const post_2 = require("../../models/post");
const user_1 = require("../../models/user");
const following_1 = require("../../models/following");
const drive_file_1 = require("../../models/drive-file");
const post_3 = require("../../serializers/post");
const notify_1 = require("../../common/notify");
const event_1 = require("../../event");
const conf_1 = require("../../../conf");
/**
 * Create a post
 *
 * @param {any} params
 * @param {any} user
 * @param {any} app
 * @return {Promise<any>}
 */
module.exports = (params, user, app) => new Promise(async (res, rej) => {
    // Get 'text' parameter
    const [text, textErr] = cafy_1.default(params.text).optional.string().pipe(post_2.isValidText).$;
    if (textErr)
        return rej('invalid text');
    // Get 'media_ids' parameter
    const [mediaIds, mediaIdsErr] = cafy_1.default(params.media_ids).optional.array('id').unique().range(1, 4).$;
    if (mediaIdsErr)
        return rej('invalid media_ids');
    let files = [];
    if (mediaIds !== undefined) {
        // Fetch files
        // forEach だと途中でエラーなどがあっても return できないので
        // 敢えて for を使っています。
        for (let i = 0; i < mediaIds.length; i++) {
            const mediaId = mediaIds[i];
            // Fetch file
            // SELECT _id
            const entity = await drive_file_1.default.findOne({
                _id: mediaId,
                user_id: user._id
            }, {
                _id: true
            });
            if (entity === null) {
                return rej('file not found');
            }
            else {
                files.push(entity);
            }
        }
    }
    else {
        files = null;
    }
    // Get 'repost_id' parameter
    const [repostId, repostIdErr] = cafy_1.default(params.repost_id).optional.id().$;
    if (repostIdErr)
        return rej('invalid repost_id');
    let repost = null;
    if (repostId !== undefined) {
        // Fetch repost to post
        repost = await post_1.default.findOne({
            _id: repostId
        });
        if (repost == null) {
            return rej('repostee is not found');
        }
        else if (repost.repost_id && !repost.text && !repost.media_ids) {
            return rej('cannot repost to repost');
        }
        // Fetch recently post
        const latestPost = await post_1.default.findOne({
            user_id: user._id
        }, {
            sort: {
                _id: -1
            }
        });
        // 直近と同じRepost対象かつ引用じゃなかったらエラー
        if (latestPost &&
            latestPost.repost_id &&
            latestPost.repost_id.equals(repost._id) &&
            text === undefined && files === null) {
            return rej('二重Repostです(NEED TRANSLATE)');
        }
        // 直近がRepost対象かつ引用じゃなかったらエラー
        if (latestPost &&
            latestPost._id.equals(repost._id) &&
            text === undefined && files === null) {
            return rej('二重Repostです(NEED TRANSLATE)');
        }
    }
    // Get 'in_reply_to_post_id' parameter
    const [inReplyToPostId, inReplyToPostIdErr] = cafy_1.default(params.reply_to_id).optional.id().$;
    if (inReplyToPostIdErr)
        return rej('invalid in_reply_to_post_id');
    let inReplyToPost = null;
    if (inReplyToPostId !== undefined) {
        // Fetch reply
        inReplyToPost = await post_1.default.findOne({
            _id: inReplyToPostId
        });
        if (inReplyToPost === null) {
            return rej('in reply to post is not found');
        }
        // 返信対象が引用でないRepostだったらエラー
        if (inReplyToPost.repost_id && !inReplyToPost.text && !inReplyToPost.media_ids) {
            return rej('cannot reply to repost');
        }
    }
    // Get 'poll' parameter
    const [poll, pollErr] = cafy_1.default(params.poll).optional.strict.object()
        .have('choices', cafy_1.default().array('string')
        .unique()
        .range(2, 10)
        .each(c => c.length > 0 && c.length < 50))
        .$;
    if (pollErr)
        return rej('invalid poll');
    if (poll) {
        poll.choices = poll.choices.map((choice, i) => ({
            id: i,
            text: choice.trim(),
            votes: 0
        }));
    }
    // テキストが無いかつ添付ファイルが無いかつRepostも無いかつ投票も無かったらエラー
    if (text === undefined && files === null && repost === null && poll === undefined) {
        return rej('text, media_ids, repost_id or poll is required');
    }
    // 直近の投稿と重複してたらエラー
    // TODO: 直近の投稿が一日前くらいなら重複とは見なさない
    if (user.latest_post) {
        if (deepEqual({
            text: user.latest_post.text,
            reply: user.latest_post.reply_to_id ? user.latest_post.reply_to_id.toString() : null,
            repost: user.latest_post.repost_id ? user.latest_post.repost_id.toString() : null,
            media_ids: (user.latest_post.media_ids || []).map(id => id.toString())
        }, {
            text: text,
            reply: inReplyToPost ? inReplyToPost._id.toString() : null,
            repost: repost ? repost._id.toString() : null,
            media_ids: (files || []).map(file => file._id.toString())
        })) {
            return rej('duplicate');
        }
    }
    // 投稿を作成
    const post = await post_1.default.insert({
        created_at: new Date(),
        media_ids: files ? files.map(file => file._id) : undefined,
        reply_to_id: inReplyToPost ? inReplyToPost._id : undefined,
        repost_id: repost ? repost._id : undefined,
        poll: poll,
        text: text,
        user_id: user._id,
        app_id: app ? app._id : null
    });
    // Serialize
    const postObj = await post_3.default(post);
    // Reponse
    res(postObj);
    //--------------------------------
    // Post processes
    user_1.default.update({ _id: user._id }, {
        $set: {
            latest_post: post
        }
    });
    let mentions = [];
    function addMention(mentionee, type) {
        // Reject if already added
        if (mentions.some(x => x.equals(mentionee)))
            return;
        // Add mention
        mentions.push(mentionee);
        // Publish event
        if (!user._id.equals(mentionee)) {
            event_1.default(mentionee, type, postObj);
        }
    }
    // Publish event to myself's stream
    event_1.default(user._id, 'post', postObj);
    // Fetch all followers
    const followers = await following_1.default
        .find({
        followee_id: user._id,
        // 削除されたドキュメントは除く
        deleted_at: { $exists: false }
    }, {
        follower_id: true,
        _id: false
    });
    // Publish event to followers stream
    followers.forEach(following => event_1.default(following.follower_id, 'post', postObj));
    // Increment my posts count
    user_1.default.update({ _id: user._id }, {
        $inc: {
            posts_count: 1
        }
    });
    // If has in reply to post
    if (inReplyToPost) {
        // Increment replies count
        post_1.default.update({ _id: inReplyToPost._id }, {
            $inc: {
                replies_count: 1
            }
        });
        // 自分自身へのリプライでない限りは通知を作成
        notify_1.default(inReplyToPost.user_id, user._id, 'reply', {
            post_id: post._id
        });
        // Add mention
        addMention(inReplyToPost.user_id, 'reply');
    }
    // If it is repost
    if (repost) {
        // Notify
        const type = text ? 'quote' : 'repost';
        notify_1.default(repost.user_id, user._id, type, {
            post_id: post._id
        });
        // If it is quote repost
        if (text) {
            // Add mention
            addMention(repost.user_id, 'quote');
        }
        else {
            // Publish event
            if (!user._id.equals(repost.user_id)) {
                event_1.default(repost.user_id, 'repost', postObj);
            }
        }
        // 今までで同じ投稿をRepostしているか
        const existRepost = await post_1.default.findOne({
            user_id: user._id,
            repost_id: repost._id,
            _id: {
                $ne: post._id
            }
        });
        if (!existRepost) {
            // Update repostee status
            post_1.default.update({ _id: repost._id }, {
                $inc: {
                    repost_count: 1
                }
            });
        }
    }
    // If has text content
    if (text) {
        // Analyze
        const tokens = text_1.default(text);
        /*
                // Extract a hashtags
                const hashtags = tokens
                    .filter(t => t.type == 'hashtag')
                    .map(t => t.hashtag)
                    // Drop dupulicates
                    .filter((v, i, s) => s.indexOf(v) == i);
        
                // ハッシュタグをデータベースに登録
                registerHashtags(user, hashtags);
        */
        // Extract an '@' mentions
        const atMentions = tokens
            .filter(t => t.type == 'mention')
            .map(m => m.username)
            .filter((v, i, s) => s.indexOf(v) == i);
        // Resolve all mentions
        await Promise.all(atMentions.map(async (mention) => {
            // Fetch mentioned user
            // SELECT _id
            const mentionee = await user_1.default
                .findOne({
                username_lower: mention.toLowerCase()
            }, { _id: true });
            // When mentioned user not found
            if (mentionee == null)
                return;
            // 既に言及されたユーザーに対する返信や引用repostの場合も無視
            if (inReplyToPost && inReplyToPost.user_id.equals(mentionee._id))
                return;
            if (repost && repost.user_id.equals(mentionee._id))
                return;
            // Add mention
            addMention(mentionee._id, 'mention');
            // Create notification
            notify_1.default(mentionee._id, user._id, 'mention', {
                post_id: post._id
            });
            return;
        }));
    }
    // Register to search database
    if (text && conf_1.default.elasticsearch.enable) {
        const es = require('../../../db/elasticsearch');
        es.index({
            index: 'misskey',
            type: 'post',
            id: post._id.toString(),
            body: {
                text: post.text
            }
        });
    }
    // Append mentions data
    if (mentions.length > 0) {
        post_1.default.update({ _id: post._id }, {
            $set: {
                mentions: mentions
            }
        });
    }
});
