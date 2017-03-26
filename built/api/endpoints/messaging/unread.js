"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const messaging_message_1 = require("../../models/messaging-message");
/**
 * Get count of unread messages
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    const count = await messaging_message_1.default
        .count({
        recipient_id: user._id,
        is_read: false
    });
    res({
        count: count
    });
});
