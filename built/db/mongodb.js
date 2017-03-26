"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo = require("monk");
const conf_1 = require("../conf");
const uri = conf_1.default.mongodb.user && conf_1.default.mongodb.pass
    ? `mongodb://${conf_1.default.mongodb.user}:${conf_1.default.mongodb.pass}@${conf_1.default.mongodb.host}:${conf_1.default.mongodb.port}/${conf_1.default.mongodb.db}`
    : `mongodb://${conf_1.default.mongodb.host}:${conf_1.default.mongodb.port}/${conf_1.default.mongodb.db}`;
const db = mongo(uri);
exports.default = db;
