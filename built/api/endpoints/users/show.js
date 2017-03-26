"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const user_1 = require("../../models/user");
const user_2 = require("../../serializers/user");
/**
 * Show a user
 *
 * @param {any} params
 * @param {any} me
 * @return {Promise<any>}
 */
module.exports = (params, me) => new Promise(async (res, rej) => {
    // Get 'user_id' parameter
    const [userId, userIdErr] = cafy_1.default(params.user_id).optional.id().$;
    if (userIdErr)
        return rej('invalid user_id param');
    // Get 'username' parameter
    const [username, usernameErr] = cafy_1.default(params.username).optional.string().$;
    if (usernameErr)
        return rej('invalid username param');
    if (userId === undefined && username === undefined) {
        return rej('user_id or username is required');
    }
    const q = userId !== undefined
        ? { _id: userId }
        : { username_lower: username.toLowerCase() };
    // Lookup user
    const user = await user_1.default.findOne(q, {
        fields: {
            data: false
        }
    });
    if (user === null) {
        return rej('user not found');
    }
    // Send response
    res(await user_2.default(user, me, {
        detail: true
    }));
});
