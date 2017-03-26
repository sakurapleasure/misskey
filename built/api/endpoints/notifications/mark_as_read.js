"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const notification_1 = require("../../models/notification");
const notification_2 = require("../../serializers/notification");
const event_1 = require("../../event");
/**
 * Mark as read a notification
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    const [notificationId, notificationIdErr] = cafy_1.default(params.notification_id).id().$;
    if (notificationIdErr)
        return rej('invalid notification_id param');
    // Get notification
    const notification = await notification_1.default
        .findOne({
        _id: notificationId,
        i: user._id
    });
    if (notification === null) {
        return rej('notification-not-found');
    }
    // Update
    notification.is_read = true;
    notification_1.default.update({ _id: notification._id }, {
        $set: {
            is_read: true
        }
    });
    // Response
    res();
    // Serialize
    const notificationObj = await notification_2.default(notification);
    // Publish read_notification event
    event_1.default(user._id, 'read_notification', notificationObj);
});
