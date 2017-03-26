"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
const conf_1 = require("../conf");
exports.default = redis.createClient(conf_1.default.redis.port, conf_1.default.redis.host, {
    auth_pass: conf_1.default.redis.pass
});
