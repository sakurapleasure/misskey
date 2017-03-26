"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Limiter = require("ratelimiter");
const debug = require("debug");
const redis_1 = require("../db/redis");
const log = debug('misskey:limitter');
exports.default = (endpoint, ctx) => new Promise((ok, reject) => {
    const limitation = endpoint.limit;
    const key = limitation.hasOwnProperty('key')
        ? limitation.key
        : endpoint.name;
    const hasShortTermLimit = limitation.hasOwnProperty('minInterval');
    const hasLongTermLimit = limitation.hasOwnProperty('duration') &&
        limitation.hasOwnProperty('max');
    if (hasShortTermLimit) {
        min();
    }
    else if (hasLongTermLimit) {
        max();
    }
    else {
        ok();
    }
    // Short-term limit
    function min() {
        const minIntervalLimiter = new Limiter({
            id: `${ctx.user._id}:${key}:min`,
            duration: limitation.minInterval,
            max: 1,
            db: redis_1.default
        });
        minIntervalLimiter.get((err, info) => {
            if (err) {
                return reject('ERR');
            }
            log(`@${ctx.user.username} ${endpoint.name} min remaining: ${info.remaining}`);
            if (info.remaining === 0) {
                reject('BRIEF_REQUEST_INTERVAL');
            }
            else {
                if (hasLongTermLimit) {
                    max();
                }
                else {
                    ok();
                }
            }
        });
    }
    // Long term limit
    function max() {
        const limiter = new Limiter({
            id: `${ctx.user._id}:${key}`,
            duration: limitation.duration,
            max: limitation.max,
            db: redis_1.default
        });
        limiter.get((err, info) => {
            if (err) {
                return reject('ERR');
            }
            log(`@${ctx.user.username} ${endpoint.name} max remaining: ${info.remaining}`);
            if (info.remaining === 0) {
                reject('RATE_LIMIT_EXCEEDED');
            }
            else {
                ok();
            }
        });
    }
});
