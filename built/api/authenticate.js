"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./models/app");
const user_1 = require("./models/user");
const access_token_1 = require("./models/access-token");
const is_native_token_1 = require("./common/is-native-token");
exports.default = (req) => new Promise(async (resolve, reject) => {
    const token = req.body['i'];
    if (token == null) {
        return resolve({ app: null, user: null, isSecure: false });
    }
    if (is_native_token_1.default(token)) {
        const user = await user_1.default
            .findOne({ token: token });
        if (user === null) {
            return reject('user not found');
        }
        return resolve({
            app: null,
            user: user,
            isSecure: true
        });
    }
    else {
        const accessToken = await access_token_1.default.findOne({
            hash: token.toLowerCase()
        });
        if (accessToken === null) {
            return reject('invalid signature');
        }
        const app = await app_1.default
            .findOne({ _id: accessToken.app_id });
        const user = await user_1.default
            .findOne({ _id: accessToken.user_id });
        return resolve({ app: app, user: user, isSecure: false });
    }
});
