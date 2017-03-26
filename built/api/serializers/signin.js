"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const deepcopy = require("deepcopy");
/**
 * Serialize a signin record
 *
 * @param {any} record
 * @return {Promise<any>}
 */
exports.default = (record) => new Promise(async (resolve, reject) => {
    const _record = deepcopy(record);
    // Rename _id to id
    _record.id = _record._id;
    delete _record._id;
    resolve(_record);
});
