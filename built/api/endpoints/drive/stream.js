"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const drive_file_1 = require("../../models/drive-file");
const drive_file_2 = require("../../serializers/drive-file");
/**
 * Get drive stream
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
    // Get 'since_id' parameter
    const [sinceId, sinceIdErr] = cafy_1.default(params.since_id).optional.id().$;
    if (sinceIdErr)
        return rej('invalid since_id param');
    // Get 'max_id' parameter
    const [maxId, maxIdErr] = cafy_1.default(params.max_id).optional.id().$;
    if (maxIdErr)
        return rej('invalid max_id param');
    // Check if both of since_id and max_id is specified
    if (sinceId && maxId) {
        return rej('cannot set since_id and max_id');
    }
    // Get 'type' parameter
    const [type, typeErr] = cafy_1.default(params.type).optional.string().match(/^[a-zA-Z\/\-\*]+$/).$;
    if (typeErr)
        return rej('invalid type param');
    // Construct query
    const sort = {
        _id: -1
    };
    const query = {
        user_id: user._id
    };
    if (sinceId) {
        sort._id = 1;
        query._id = {
            $gt: sinceId
        };
    }
    else if (maxId) {
        query._id = {
            $lt: maxId
        };
    }
    if (type) {
        query.type = new RegExp(`^${type.replace(/\*/g, '.+?')}$`);
    }
    // Issue query
    const files = await drive_file_1.default
        .find(query, {
        fields: {
            data: false
        },
        limit: limit,
        sort: sort
    });
    // Serialize
    res(await Promise.all(files.map(async (file) => await drive_file_2.default(file))));
});
