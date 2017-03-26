"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const notification_1 = require("../../models/notification");
const notification_2 = require("../../serializers/notification");
const get_friends_1 = require("../../common/get-friends");
/**
 * Get notifications
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Get 'following' parameter
    const [following = false, followingError] = cafy_1.default(params.following).optional.boolean().$;
    if (followingError)
        return rej('invalid following param');
    // Get 'mark_as_read' parameter
    const [markAsRead = true, markAsReadErr] = cafy_1.default(params.mark_as_read).optional.boolean().$;
    if (markAsReadErr)
        return rej('invalid mark_as_read param');
    // Get 'type' parameter
    const [type, typeErr] = cafy_1.default(params.type).optional.array('string').unique().$;
    if (typeErr)
        return rej('invalid type param');
    // Get 'limit' parameter
    const [limit = 10, limitErr] = cafy_1.default(params.limit).optional.number().range(1, 100).$;
    if (limitErr)
        return rej('invalid limit param');
    // Get 'since_id' parameter
    const [sinceId, sinceIdErr] = cafy_1.default(params.since_id).optional.id().$;
    if (sinceIdErr)
        return rej('invalid since_id param');
    // Get 'max_id' parameter
    const [maxId, maxIdErr] = cafy_1.default(params.max_id).optional.id().$;
    if (maxIdErr)
        return rej('invalid max_id param');
    // Check if both of since_id and max_id is specified
    if (sinceId && maxId) {
        return rej('cannot set since_id and max_id');
    }
    const query = {
        notifiee_id: user._id
    };
    const sort = {
        _id: -1
    };
    if (following) {
        // ID list of the user $self and other users who the user follows
        const followingIds = await get_friends_1.default(user._id);
        query.notifier_id = {
            $in: followingIds
        };
    }
    if (type) {
        query.type = {
            $in: type
        };
    }
    if (sinceId) {
        sort._id = 1;
        query._id = {
            $gt: sinceId
        };
    }
    else if (maxId) {
        query._id = {
            $lt: maxId
        };
    }
    // Issue query
    const notifications = await notification_1.default
        .find(query, {
        limit: limit,
        sort: sort
    });
    // Serialize
    res(await Promise.all(notifications.map(async (notification) => await notification_2.default(notification))));
    // Mark as read all
    if (notifications.length > 0 && markAsRead) {
        const ids = notifications
            .filter(x => x.is_read == false)
            .map(x => x._id);
        // Update documents
        await notification_1.default.update({
            _id: { $in: ids }
        }, {
            $set: { is_read: true }
        }, {
            multi: true
        });
    }
});
