"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../../db/mongodb");
const collection = mongodb_1.default.get('drive_files');
collection.index('hash'); // fuck type definition
exports.default = collection; // fuck type definition
function validateFileName(name) {
    return ((name.trim().length > 0) &&
        (name.length <= 200) &&
        (name.indexOf('\\') === -1) &&
        (name.indexOf('/') === -1) &&
        (name.indexOf('..') === -1));
}
exports.validateFileName = validateFileName;
