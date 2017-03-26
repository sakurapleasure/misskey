"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const mongo = require("mongodb");
const deepcopy = require("deepcopy");
const app_1 = require("./app");
/**
 * Serialize an auth session
 *
 * @param {any} session
 * @param {any} me?
 * @return {Promise<any>}
 */
exports.default = (session, me) => new Promise(async (resolve, reject) => {
    let _session;
    // TODO: Populate session if it ID
    _session = deepcopy(session);
    // Me
    if (me && !mongo.ObjectID.prototype.isPrototypeOf(me)) {
        if (typeof me === 'string') {
            me = new mongo.ObjectID(me);
        }
        else {
            me = me._id;
        }
    }
    delete _session._id;
    // Populate app
    _session.app = await app_1.default(_session.app_id, me);
    resolve(_session);
});
