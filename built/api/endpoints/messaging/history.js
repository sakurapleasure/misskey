"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const messaging_history_1 = require("../../models/messaging-history");
const messaging_message_1 = require("../../serializers/messaging-message");
/**
 * Show messaging history
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Get 'limit' parameter
    const [limit = 10, limitErr] = cafy_1.default(params.limit).optional.number().range(1, 100).$;
    if (limitErr)
        return rej('invalid limit param');
    // Get history
    const history = await messaging_history_1.default
        .find({
        user_id: user._id
    }, {
        limit: limit,
        sort: {
            updated_at: -1
        }
    });
    // Serialize
    res(await Promise.all(history.map(async (h) => await messaging_message_1.default(h.message, user))));
});
