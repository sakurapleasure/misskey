"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const app_1 = require("../../../models/app");
const app_2 = require("../../../models/app");
/**
 * @swagger
 * /app/name_id/available:
 *   post:
 *     summary: Check available name_id on creation an application
 *     parameters:
 *       -
 *         name: name_id
 *         description: Application unique name
 *         in: formData
 *         required: true
 *         type: string
 *
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           type: object
 *           properties:
 *             available:
 *               description: Whether name_id is available
 *               type: boolean
 *
 *       default:
 *         description: Failed
 *         schema:
 *           $ref: "#/definitions/Error"
 */
/**
 * Check available name_id of app
 *
 * @param {any} params
 * @return {Promise<any>}
 */
module.exports = async (params) => new Promise(async (res, rej) => {
    // Get 'name_id' parameter
    const [nameId, nameIdErr] = cafy_1.default(params.name_id).string().pipe(app_2.isValidNameId).$;
    if (nameIdErr)
        return rej('invalid name_id param');
    // Get exist
    const exist = await app_1.default
        .count({
        name_id_lower: nameId.toLowerCase()
    }, {
        limit: 1
    });
    // Reply
    res({
        available: exist === 0
    });
});
