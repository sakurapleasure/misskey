"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const mongo = require("mongodb");
const drive_tag_1 = require("../models/drive-tag");
const deepcopy = require("deepcopy");
/**
 * Serialize a drive tag
 *
 * @param {any} tag
 * @return {Promise<any>}
 */
const self = (tag) => new Promise(async (resolve, reject) => {
    let _tag;
    // Populate the tag if 'tag' is ID
    if (mongo.ObjectID.prototype.isPrototypeOf(tag)) {
        _tag = await drive_tag_1.default.findOne({ _id: tag });
    }
    else if (typeof tag === 'string') {
        _tag = await drive_tag_1.default.findOne({ _id: new mongo.ObjectID(tag) });
    }
    else {
        _tag = deepcopy(tag);
    }
    // Rename _id to id
    _tag.id = _tag._id;
    delete _tag._id;
    resolve(_tag);
});
exports.default = self;
