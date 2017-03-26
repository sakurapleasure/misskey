"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const appdata_1 = require("../../../models/appdata");
/**
 * Get app data
 *
 * @param {any} params
 * @param {any} user
 * @param {any} app
 * @param {Boolean} isSecure
 * @return {Promise<any>}
 */
module.exports = (params, user, app, isSecure) => new Promise(async (res, rej) => {
    // Get 'key' parameter
    const [key = null, keyError] = cafy_1.default(params.key).optional.nullable.string().match(/[a-z_]+/).$;
    if (keyError)
        return rej('invalid key param');
    if (isSecure) {
        if (!user.data) {
            return res();
        }
        if (key !== null) {
            const data = {};
            data[key] = user.data[key];
            res(data);
        }
        else {
            res(user.data);
        }
    }
    else {
        const select = {};
        if (key !== null) {
            select['data.' + key] = true;
        }
        const appdata = await appdata_1.default.findOne({
            app_id: app._id,
            user_id: user._id
        }, {
            fields: select
        });
        if (appdata) {
            res(appdata.data);
        }
        else {
            res();
        }
    }
});
