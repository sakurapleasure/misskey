"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const user_1 = require("../../models/user");
const user_2 = require("../../serializers/user");
/**
 * Search a user by username
 *
 * @param {any} params
 * @param {any} me
 * @return {Promise<any>}
 */
module.exports = (params, me) => new Promise(async (res, rej) => {
    // Get 'query' parameter
    const [query, queryError] = cafy_1.default(params.query).string().$;
    if (queryError)
        return rej('invalid query param');
    // Get 'offset' parameter
    const [offset = 0, offsetErr] = cafy_1.default(params.offset).optional.number().min(0).$;
    if (offsetErr)
        return rej('invalid offset param');
    // Get 'limit' parameter
    const [limit = 10, limitErr] = cafy_1.default(params.limit).optional.number().range(1, 100).$;
    if (limitErr)
        return rej('invalid limit param');
    const users = await user_1.default
        .find({
        username_lower: new RegExp(query.toLowerCase())
    }, {
        limit: limit,
        skip: offset
    });
    // Serialize
    res(await Promise.all(users.map(async (user) => await user_2.default(user, me, { detail: true }))));
});
