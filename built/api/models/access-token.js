"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../../db/mongodb");
const collection = mongodb_1.default.get('access_tokens');
collection.index('token'); // fuck type definition
collection.index('hash'); // fuck type definition
exports.default = collection; // fuck type definition
