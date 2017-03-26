"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const rndstr_1 = require("rndstr");
const crypto = require('crypto');
const cafy_1 = require("cafy");
const app_1 = require("../../models/app");
const auth_session_1 = require("../../models/auth-session");
const access_token_1 = require("../../models/access-token");
/**
 * @swagger
 * /auth/accept:
 *   post:
 *     summary: Accept a session
 *     parameters:
 *       - $ref: "#/parameters/NativeToken"
 *       -
 *         name: token
 *         description: Session Token
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: OK
 *
 *       default:
 *         description: Failed
 *         schema:
 *           $ref: "#/definitions/Error"
 */
/**
 * Accept
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Get 'token' parameter
    const [token, tokenErr] = cafy_1.default(params.token).string().$;
    if (tokenErr)
        return rej('invalid token param');
    // Fetch token
    const session = await auth_session_1.default
        .findOne({ token: token });
    if (session === null) {
        return rej('session not found');
    }
    // Generate access token
    const accessToken = rndstr_1.default('a-zA-Z0-9', 32);
    // Fetch exist access token
    const exist = await access_token_1.default.findOne({
        app_id: session.app_id,
        user_id: user._id,
    });
    if (exist === null) {
        // Lookup app
        const app = await app_1.default.findOne({
            _id: session.app_id
        });
        // Generate Hash
        const sha256 = crypto.createHash('sha256');
        sha256.update(accessToken + app.secret);
        const hash = sha256.digest('hex');
        // Insert access token doc
        await access_token_1.default.insert({
            created_at: new Date(),
            app_id: session.app_id,
            user_id: user._id,
            token: accessToken,
            hash: hash
        });
    }
    // Update session
    await auth_session_1.default.update(session._id, {
        $set: {
            user_id: user._id
        }
    });
    // Response
    res();
});
