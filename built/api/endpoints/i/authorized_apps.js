"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const access_token_1 = require("../../models/access-token");
const app_1 = require("../../serializers/app");
/**
 * Get authorized apps of my account
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
    // Get 'offset' parameter
    const [offset = 0, offsetErr] = cafy_1.default(params.offset).optional.number().min(0).$;
    if (offsetErr)
        return rej('invalid offset param');
    // Get 'sort' parameter
    const [sort = 'desc', sortError] = cafy_1.default(params.sort).optional.string().or('desc asc').$;
    if (sortError)
        return rej('invalid sort param');
    // Get tokens
    const tokens = await access_token_1.default
        .find({
        user_id: user._id
    }, {
        limit: limit,
        skip: offset,
        sort: {
            _id: sort == 'asc' ? 1 : -1
        }
    });
    // Serialize
    res(await Promise.all(tokens.map(async (token) => await app_1.default(token.app_id))));
});
