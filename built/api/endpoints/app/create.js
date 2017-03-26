"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const rndstr_1 = require("rndstr");
const cafy_1 = require("cafy");
const app_1 = require("../../models/app");
const app_2 = require("../../models/app");
const app_3 = require("../../serializers/app");
/**
 * @swagger
 * /app/create:
 *   post:
 *     summary: Create an application
 *     parameters:
 *       - $ref: "#/parameters/AccessToken"
 *       -
 *         name: name_id
 *         description: Application unique name
 *         in: formData
 *         required: true
 *         type: string
 *       -
 *         name: name
 *         description: Application name
 *         in: formData
 *         required: true
 *         type: string
 *       -
 *         name: description
 *         description: Application description
 *         in: formData
 *         required: true
 *         type: string
 *       -
 *         name: permission
 *         description: Permissions that application has
 *         in: formData
 *         required: true
 *         type: array
 *         items:
 *           type: string
 *           collectionFormat: csv
 *       -
 *         name: callback_url
 *         description: URL called back after authentication
 *         in: formData
 *         required: false
 *         type: string
 *
 *     responses:
 *       200:
 *         description: Created application's information
 *         schema:
 *           $ref: "#/definitions/Application"
 *
 *       default:
 *         description: Failed
 *         schema:
 *           $ref: "#/definitions/Error"
 */
/**
 * Create an app
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = async (params, user) => new Promise(async (res, rej) => {
    // Get 'name_id' parameter
    const [nameId, nameIdErr] = cafy_1.default(params.name_id).string().pipe(app_2.isValidNameId).$;
    if (nameIdErr)
        return rej('invalid name_id param');
    // Get 'name' parameter
    const [name, nameErr] = cafy_1.default(params.name).string().$;
    if (nameErr)
        return rej('invalid name param');
    // Get 'description' parameter
    const [description, descriptionErr] = cafy_1.default(params.description).string().$;
    if (descriptionErr)
        return rej('invalid description param');
    // Get 'permission' parameter
    const [permission, permissionErr] = cafy_1.default(params.permission).array('string').unique().$;
    if (permissionErr)
        return rej('invalid permission param');
    // Get 'callback_url' parameter
    // TODO: Check $ is valid url
    const [callbackUrl = null, callbackUrlErr] = cafy_1.default(params.callback_url).optional.nullable.string().$;
    if (callbackUrlErr)
        return rej('invalid callback_url param');
    // Generate secret
    const secret = rndstr_1.default('a-zA-Z0-9', 32);
    // Create account
    const app = await app_1.default.insert({
        created_at: new Date(),
        user_id: user._id,
        name: name,
        name_id: nameId,
        name_id_lower: nameId.toLowerCase(),
        description: description,
        permission: permission,
        callback_url: callbackUrl,
        secret: secret
    });
    // Response
    res(await app_3.default(app));
});
