"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const appdata_1 = require("../../../models/appdata");
const user_1 = require("../../../models/user");
const user_2 = require("../../../serializers/user");
const event_1 = require("../../../event");
/**
 * Set app data
 *
 * @param {any} params
 * @param {any} user
 * @param {any} app
 * @param {Boolean} isSecure
 * @return {Promise<any>}
 */
module.exports = (params, user, app, isSecure) => new Promise(async (res, rej) => {
    // Get 'data' parameter
    const [data, dataError] = cafy_1.default(params.data).optional.object()
        .pipe(obj => {
        const hasInvalidData = Object.entries(obj).some(([k, v]) => cafy_1.default(k).string().match(/^[a-z_]+$/).isNg() && cafy_1.default(v).string().isNg());
        return !hasInvalidData;
    }).$;
    if (dataError)
        return rej('invalid data param');
    // Get 'key' parameter
    const [key, keyError] = cafy_1.default(params.key).optional.string().match(/[a-z_]+/).$;
    if (keyError)
        return rej('invalid key param');
    // Get 'value' parameter
    const [value, valueError] = cafy_1.default(params.value).optional.string().$;
    if (valueError)
        return rej('invalid value param');
    let set = {};
    if (data) {
        Object.entries(data).forEach(([k, v]) => {
            set['data.' + k] = v;
        });
    }
    else {
        set['data.' + key] = value;
    }
    if (isSecure) {
        const _user = await user_1.default.findOneAndUpdate(user._id, {
            $set: set
        });
        res(204);
        // Publish i updated event
        event_1.default(user._id, 'i_updated', await user_2.default(_user, user, {
            detail: true,
            includeSecrets: true
        }));
    }
    else {
        await appdata_1.default.update({
            app_id: app._id,
            user_id: user._id
        }, Object.assign({
            app_id: app._id,
            user_id: user._id
        }, {
            $set: set
        }), {
            upsert: true
        });
        res(204);
    }
});
