"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as Twitter from 'twitter';
//const Twitter = require('twitter');
const autwh_1 = require("autwh");
const redis_1 = require("../../db/redis");
const user_1 = require("../models/user");
const user_2 = require("../serializers/user");
const event_1 = require("../event");
const conf_1 = require("../../conf");
module.exports = (app) => {
    app.get('/disconnect/twitter', async (req, res) => {
        if (res.locals.user == null)
            return res.send('plz signin');
        const user = await user_1.default.findOneAndUpdate({
            token: res.locals.user
        }, {
            $set: {
                twitter: null
            }
        });
        res.send(`Twitterの連携を解除しました :v:`);
        // Publish i updated event
        event_1.default(user._id, 'i_updated', await user_2.default(user, user, {
            detail: true,
            includeSecrets: true
        }));
    });
    if (conf_1.default.twitter == null) {
        app.get('/connect/twitter', (req, res) => {
            res.send('現在Twitterへ接続できません');
        });
        return;
    }
    const twAuth = autwh_1.default({
        consumerKey: conf_1.default.twitter.consumer_key,
        consumerSecret: conf_1.default.twitter.consumer_secret,
        callbackUrl: conf_1.default.api_url + '/tw/cb'
    });
    app.get('/connect/twitter', async (req, res) => {
        if (res.locals.user == null)
            return res.send('plz signin');
        const ctx = await twAuth.begin();
        redis_1.default.set(res.locals.user, JSON.stringify(ctx));
        res.redirect(ctx.url);
    });
    app.get('/tw/cb', (req, res) => {
        if (res.locals.user == null)
            return res.send('plz signin');
        redis_1.default.get(res.locals.user, async (_, ctx) => {
            const result = await twAuth.done(JSON.parse(ctx), req.query.oauth_verifier);
            const user = await user_1.default.findOneAndUpdate({
                token: res.locals.user
            }, {
                $set: {
                    twitter: {
                        access_token: result.accessToken,
                        access_token_secret: result.accessTokenSecret,
                        user_id: result.userId,
                        screen_name: result.screenName
                    }
                }
            });
            res.send(`Twitter: @${result.screenName} を、Misskey: @${user.username} に接続しました！`);
            // Publish i updated event
            event_1.default(user._id, 'i_updated', await user_2.default(user, user, {
                detail: true,
                includeSecrets: true
            }));
        });
    });
};
