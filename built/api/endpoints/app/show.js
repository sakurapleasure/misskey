"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const app_1 = require("../../models/app");
const app_2 = require("../../serializers/app");
/**
 * @swagger
 * /app/show:
 *   post:
 *     summary: Show an application's information
 *     description: Require app_id or name_id
 *     parameters:
 *       -
 *         name: app_id
 *         description: Application ID
 *         in: formData
 *         type: string
 *       -
 *         name: name_id
 *         description: Application unique name
 *         in: formData
 *         type: string
 *
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           $ref: "#/definitions/Application"
 *
 *       default:
 *         description: Failed
 *         schema:
 *           $ref: "#/definitions/Error"
 */
/**
 * Show an app
 *
 * @param {any} params
 * @param {any} user
 * @param {any} _
 * @param {any} isSecure
 * @return {Promise<any>}
 */
module.exports = (params, user, _, isSecure) => new Promise(async (res, rej) => {
    // Get 'app_id' parameter
    const [appId, appIdErr] = cafy_1.default(params.app_id).optional.id().$;
    if (appIdErr)
        return rej('invalid app_id param');
    // Get 'name_id' parameter
    const [nameId, nameIdErr] = cafy_1.default(params.name_id).optional.string().$;
    if (nameIdErr)
        return rej('invalid name_id param');
    if (appId === undefined && nameId === undefined) {
        return rej('app_id or name_id is required');
    }
    // Lookup app
    const app = appId !== undefined
        ? await app_1.default.findOne({ _id: appId })
        : await app_1.default.findOne({ name_id_lower: nameId.toLowerCase() });
    if (app === null) {
        return rej('app not found');
    }
    // Send response
    res(await app_2.default(app, user, {
        includeSecret: isSecure && app.user_id.equals(user._id)
    }));
});
