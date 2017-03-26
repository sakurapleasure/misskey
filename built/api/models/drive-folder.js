"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../../db/mongodb");
exports.default = mongodb_1.default.get('drive_folders'); // fuck type definition
function isValidFolderName(name) {
    return ((name.trim().length > 0) &&
        (name.length <= 200));
}
exports.isValidFolderName = isValidFolderName;
