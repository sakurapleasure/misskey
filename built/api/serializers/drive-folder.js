"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const mongo = require("mongodb");
const drive_folder_1 = require("../models/drive-folder");
const drive_file_1 = require("../models/drive-file");
const deepcopy = require("deepcopy");
/**
 * Serialize a drive folder
 *
 * @param {any} folder
 * @param {any} options?
 * @return {Promise<any>}
 */
const self = (folder, options) => new Promise(async (resolve, reject) => {
    const opts = Object.assign({
        detail: false
    }, options);
    let _folder;
    // Populate the folder if 'folder' is ID
    if (mongo.ObjectID.prototype.isPrototypeOf(folder)) {
        _folder = await drive_folder_1.default.findOne({ _id: folder });
    }
    else if (typeof folder === 'string') {
        _folder = await drive_folder_1.default.findOne({ _id: new mongo.ObjectID(folder) });
    }
    else {
        _folder = deepcopy(folder);
    }
    // Rename _id to id
    _folder.id = _folder._id;
    delete _folder._id;
    if (opts.detail) {
        const childFoldersCount = await drive_folder_1.default.count({
            parent_id: _folder.id
        });
        const childFilesCount = await drive_file_1.default.count({
            folder_id: _folder.id
        });
        _folder.folders_count = childFoldersCount;
        _folder.files_count = childFilesCount;
    }
    if (opts.detail && _folder.parent_id) {
        // Populate parent folder
        _folder.parent = await self(_folder.parent_id, {
            detail: true
        });
    }
    resolve(_folder);
});
exports.default = self;
