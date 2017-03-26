"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const app_1 = require("../../../models/app");
const auth_session_1 = require("../../../models/auth-session");
const access_token_1 = require("../../../models/access-token");
const user_1 = require("../../../serializers/user");
/**
 * @swagger
 * /auth/session/userkey:
 *   post:
 *     summary: Get an access token(userkey)
 *     parameters:
 *       -
 *         name: app_secret
 *         description: App Secret
 *         in: formData
 *         required: true
 *         type: string
 *       -
 *         name: token
 *         description: Session Token
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
 *             userkey:
 *               type: string
 *               description: Access Token
 *             user:
 *               $ref: "#/definitions/User"
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
    // Get 'token' parameter
    const [token, tokenErr] = cafy_1.default(params.token).string().$;
    if (tokenErr)
        return rej('invalid token param');
    // Fetch token
    const session = await auth_session_1.default
        .findOne({
        token: token,
        app_id: app._id
    });
    if (session === null) {
        return rej('session not found');
    }
    if (session.user_id == null) {
        return rej('this session is not allowed yet');
    }
    // Lookup access token
    const accessToken = await access_token_1.default.findOne({
        app_id: app._id,
        user_id: session.user_id
    });
    // Delete session
    /* https://github.com/Automattic/monk/issues/178
    AuthSess.deleteOne({
        _id: session._id
    });
    */
    auth_session_1.default.remove({
        _id: session._id
    });
    // Response
    res({
        access_token: accessToken.token,
        user: await user_1.default(session.user_id, null, {
            detail: true
        })
    });
});
