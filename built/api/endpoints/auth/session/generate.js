"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const uuid = require("uuid");
const cafy_1 = require("cafy");
const app_1 = require("../../../models/app");
const auth_session_1 = require("../../../models/auth-session");
const conf_1 = require("../../../../conf");
/**
 * @swagger
 * /auth/session/generate:
 *   post:
 *     summary: Generate a session
 *     parameters:
 *       -
 *         name: app_secret
 *         description: App Secret
 *         in: formData
 *         required: true
 *         type: string
 *
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: Session Token
 *             url:
 *               type: string
 *               description: Authentication form's URL
 *       default:
 *         description: Failed
 *         schema:
 *           $ref: "#/definitions/Error"
 */
/**
 * Generate a session
 *
 * @param {any} params
 * @return {Promise<any>}
 */
module.exports = (params) => new Promise(async (res, rej) => {
    // Get 'app_secret' parameter
    const [appSecret, appSecretErr] = cafy_1.default(params.app_secret).string().$;
    if (appSecretErr)
        return rej('invalid app_secret param');
    // Lookup app
    const app = await app_1.default.findOne({
        secret: appSecret
    });
    if (app == null) {
        return rej('app not found');
    }
    // Generate token
    const token = uuid.v4();
    // Create session token document
    const doc = await auth_session_1.default.insert({
        created_at: new Date(),
        app_id: app._id,
        token: token
    });
    // Response
    res({
        token: doc.token,
        url: `${conf_1.default.auth_url}/${doc.token}`
    });
});
