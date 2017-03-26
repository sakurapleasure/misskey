"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../../db/mongodb");
const collection = mongodb_1.default.get('apps');
collection.index('name_id'); // fuck type definition
collection.index('name_id_lower'); // fuck type definition
collection.index('secret'); // fuck type definition
exports.default = collection; // fuck type definition
function isValidNameId(nameId) {
    return typeof nameId == 'string' && /^[a-zA-Z0-9\-]{3,30}$/.test(nameId);
}
exports.isValidNameId = isValidNameId;
