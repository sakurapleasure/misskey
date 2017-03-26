"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version_1 = require("../../version");
const conf_1 = require("../../conf");
/**
 * @swagger
 * /meta:
 *   post:
 *     summary: Show the misskey's information
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           type: object
 *           properties:
 *             maintainer:
 *               description: maintainer's name
 *               type: string
 *             commit:
 *               description: latest commit's hash
 *               type: string
 *             secure:
 *               description: whether the server supports secure protocols
 *               type: boolean
 *
 *       default:
 *         description: Failed
 *         schema:
 *           $ref: "#/definitions/Error"
 */
/**
 * Show core info
 *
 * @param {any} params
 * @return {Promise<any>}
 */
module.exports = (params) => new Promise(async (res, rej) => {
    res({
        maintainer: conf_1.default.maintainer,
        version: version_1.default,
        secure: conf_1.default.https.enable
    });
});
