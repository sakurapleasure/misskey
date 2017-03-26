"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const mongo = require("mongodb");
const notification_1 = require("../models/notification");
const user_1 = require("./user");
const post_1 = require("./post");
const deepcopy = require("deepcopy");
/**
 * Serialize a notification
 *
 * @param {any} notification
 * @return {Promise<any>}
 */
exports.default = (notification) => new Promise(async (resolve, reject) => {
    let _notification;
    // Populate the notification if 'notification' is ID
    if (mongo.ObjectID.prototype.isPrototypeOf(notification)) {
        _notification = await notification_1.default.findOne({
            _id: notification
        });
    }
    else if (typeof notification === 'string') {
        _notification = await notification_1.default.findOne({
            _id: new mongo.ObjectID(notification)
        });
    }
    else {
        _notification = deepcopy(notification);
    }
    // Rename _id to id
    _notification.id = _notification._id;
    delete _notification._id;
    // Rename notifier_id to user_id
    _notification.user_id = _notification.notifier_id;
    delete _notification.notifier_id;
    const me = _notification.notifiee_id;
    delete _notification.notifiee_id;
    // Populate notifier
    _notification.user = await user_1.default(_notification.user_id, me);
    switch (_notification.type) {
        case 'follow':
            // nope
            break;
        case 'mention':
        case 'reply':
        case 'repost':
        case 'quote':
        case 'reaction':
        case 'poll_vote':
            // Populate post
            _notification.post = await post_1.default(_notification.post_id, me);
            break;
        default:
            console.error(`Unknown type: ${_notification.type}`);
            break;
    }
    resolve(_notification);
});
