"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const user_1 = require("../../models/user");
const user_2 = require("../../models/user");
/**
 * Check available username
 *
 * @param {any} params
 * @return {Promise<any>}
 */
module.exports = async (params) => new Promise(async (res, rej) => {
    // Get 'username' parameter
    const [username, usernameError] = cafy_1.default(params.username).string().pipe(user_2.validateUsername).$;
    if (usernameError)
        return rej('invalid username param');
    // Get exist
    const exist = await user_1.default
        .count({
        username_lower: username.toLowerCase()
    }, {
        limit: 1
    });
    // Reply
    res({
        available: exist === 0
    });
});
