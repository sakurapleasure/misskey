"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const mongo = require("mongodb");
const deepcopy = require("deepcopy");
const app_1 = require("../models/app");
const access_token_1 = require("../models/access-token");
const conf_1 = require("../../conf");
/**
 * Serialize an app
 *
 * @param {any} app
 * @param {any} me?
 * @param {any} options?
 * @return {Promise<any>}
 */
exports.default = (app, me, options) => new Promise(async (resolve, reject) => {
    const opts = options || {
        includeSecret: false,
        includeProfileImageIds: false
    };
    let _app;
    // Populate the app if 'app' is ID
    if (mongo.ObjectID.prototype.isPrototypeOf(app)) {
        _app = await app_1.default.findOne({
            _id: app
        });
    }
    else if (typeof app === 'string') {
        _app = await app_1.default.findOne({
            _id: new mongo.ObjectID(app)
        });
    }
    else {
        _app = deepcopy(app);
    }
    // Me
    if (me && !mongo.ObjectID.prototype.isPrototypeOf(me)) {
        if (typeof me === 'string') {
            me = new mongo.ObjectID(me);
        }
        else {
            me = me._id;
        }
    }
    // Rename _id to id
    _app.id = _app._id;
    delete _app._id;
    delete _app.name_id_lower;
    // Visible by only owner
    if (!opts.includeSecret) {
        delete _app.secret;
    }
    _app.icon_url = _app.icon != null
        ? `${conf_1.default.drive_url}/${_app.icon}`
        : `${conf_1.default.drive_url}/app-default.jpg`;
    if (me) {
        // 既に連携しているか
        const exist = await access_token_1.default.count({
            app_id: _app.id,
            user_id: me,
        }, {
            limit: 1
        });
        _app.is_authorized = exist === 1;
    }
    resolve(_app);
});
