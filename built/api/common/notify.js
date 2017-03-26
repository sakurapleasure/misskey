"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notification_1 = require("../models/notification");
const event_1 = require("../event");
const notification_2 = require("../serializers/notification");
exports.default = (notifiee, notifier, type, content) => new Promise(async (resolve, reject) => {
    if (notifiee.equals(notifier)) {
        return resolve();
    }
    // Create notification
    const notification = await notification_1.default.insert(Object.assign({
        created_at: new Date(),
        notifiee_id: notifiee,
        notifier_id: notifier,
        type: type,
        is_read: false
    }, content));
    resolve(notification);
    // Publish notification event
    event_1.default(notifiee, 'notification', await notification_2.default(notification));
});
