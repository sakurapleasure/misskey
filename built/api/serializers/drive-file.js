"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const mongo = require("mongodb");
const drive_file_1 = require("../models/drive-file");
const drive_folder_1 = require("./drive-folder");
const drive_tag_1 = require("./drive-tag");
const deepcopy = require("deepcopy");
const conf_1 = require("../../conf");
/**
 * Serialize a drive file
 *
 * @param {any} file
 * @param {any} options?
 * @return {Promise<any>}
 */
exports.default = (file, options) => new Promise(async (resolve, reject) => {
    const opts = Object.assign({
        detail: false
    }, options);
    let _file;
    // Populate the file if 'file' is ID
    if (mongo.ObjectID.prototype.isPrototypeOf(file)) {
        _file = await drive_file_1.default.findOne({
            _id: file
        }, {
            fields: {
                data: false
            }
        });
    }
    else if (typeof file === 'string') {
        _file = await drive_file_1.default.findOne({
            _id: new mongo.ObjectID(file)
        }, {
            fields: {
                data: false
            }
        });
    }
    else {
        _file = deepcopy(file);
    }
    // Rename _id to id
    _file.id = _file._id;
    delete _file._id;
    delete _file.data;
    _file.url = `${conf_1.default.drive_url}/${_file.id}/${encodeURIComponent(_file.name)}`;
    if (opts.detail && _file.folder_id) {
        // Populate folder
        _file.folder = await drive_folder_1.default(_file.folder_id, {
            detail: true
        });
    }
    if (opts.detail && _file.tags) {
        // Populate tags
        _file.tags = await _file.tags.map(async (tag) => await drive_tag_1.default(tag));
    }
    resolve(_file);
});
