"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocket = require("websocket");
const redis = require("redis");
const conf_1 = require("../conf");
const user_1 = require("./models/user");
const access_token_1 = require("./models/access-token");
const is_native_token_1 = require("./common/is-native-token");
const home_1 = require("./stream/home");
const messaging_1 = require("./stream/messaging");
module.exports = (server) => {
    /**
     * Init websocket server
     */
    const ws = new websocket.server({
        httpServer: server
    });
    ws.on('request', async (request) => {
        const connection = request.accept();
        const user = await authenticate(connection, request.resourceURL.query.i);
        if (user == null) {
            connection.send('authentication-failed');
            connection.close();
            return;
        }
        // Connect to Redis
        const subscriber = redis.createClient(conf_1.default.redis.port, conf_1.default.redis.host);
        connection.on('close', () => {
            subscriber.unsubscribe();
            subscriber.quit();
        });
        const channel = request.resourceURL.pathname === '/' ? home_1.default :
            request.resourceURL.pathname === '/messaging' ? messaging_1.default :
                null;
        if (channel !== null) {
            channel(request, connection, subscriber, user);
        }
        else {
            connection.close();
        }
    });
};
function authenticate(connection, token) {
    if (token == null) {
        return Promise.resolve(null);
    }
    return new Promise(async (resolve, reject) => {
        if (is_native_token_1.default(token)) {
            // Fetch user
            // SELECT _id
            const user = await user_1.default
                .findOne({
                token: token
            });
            resolve(user);
        }
        else {
            const accessToken = await access_token_1.default.findOne({
                hash: token
            });
            if (accessToken == null) {
                return reject('invalid signature');
            }
            // Fetch user
            // SELECT _id
            const user = await user_1.default
                .findOne({ _id: accessToken.user_id }, {
                fields: {
                    _id: true
                }
            });
            resolve(user);
        }
    });
}
