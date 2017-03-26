"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticate_1 = require("./authenticate");
const reply_1 = require("./reply");
const limitter_1 = require("./limitter");
exports.default = async (endpoint, req, res) => {
    const reply = reply_1.default.bind(null, res);
    let ctx;
    // Authentication
    try {
        ctx = await authenticate_1.default(req);
    }
    catch (e) {
        return reply(403, 'AUTHENTICATION_FAILED');
    }
    if (endpoint.secure && !ctx.isSecure) {
        return reply(403, 'ACCESS_DENIED');
    }
    if (endpoint.withCredential && ctx.user == null) {
        return reply(401, 'PLZ_SIGNIN');
    }
    if (ctx.app && endpoint.kind) {
        if (!ctx.app.permission.some((p) => p === endpoint.kind)) {
            return reply(403, 'ACCESS_DENIED');
        }
    }
    if (endpoint.withCredential && endpoint.limit) {
        try {
            await limitter_1.default(endpoint, ctx); // Rate limit
        }
        catch (e) {
            // drop request if limit exceeded
            return reply(429);
        }
    }
    let exec = require(`${__dirname}/endpoints/${endpoint.name}`);
    if (endpoint.withFile) {
        exec = exec.bind(null, req.file);
    }
    // API invoking
    try {
        const res = await exec(req.body, ctx.user, ctx.app, ctx.isSecure);
        reply(res);
    }
    catch (e) {
        reply(400, e);
    }
};
