"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../../db/mongodb");
exports.default = mongodb_1.default.get('posts'); // fuck type definition
function isValidText(text) {
    return text.length <= 1000 && text.trim() != '';
}
exports.isValidText = isValidText;
