"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const app_1 = require("../../models/app");
const app_2 = require("../../serializers/app");
/**
 * Get my apps
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
    const query = {
        user_id: user._id
    };
    // Execute query
    const apps = await app_1.default
        .find(query, {
        limit: limit,
        skip: offset,
        sort: {
            _id: -1
        }
    });
    // Reply
    res(await Promise.all(apps.map(async (app) => await app_2.default(app))));
});
