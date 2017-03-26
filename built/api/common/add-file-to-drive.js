"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const gm = require("gm");
const debug = require("debug");
const fileType = require("file-type");
const prominence = require("prominence");
const drive_file_1 = require("../models/drive-file");
const drive_folder_1 = require("../models/drive-folder");
const drive_file_2 = require("../serializers/drive-file");
const event_1 = require("../event");
const conf_1 = require("../../conf");
const log = debug('misskey:register-drive-file');
/**
 * Add file to drive
 *
 * @param user User who wish to add file
 * @param fileName File name
 * @param data Contents
 * @param comment Comment
 * @param type File type
 * @param folderId Folder ID
 * @param force If set to true, forcibly upload the file even if there is a file with the same hash.
 * @return Object that represents added file
 */
exports.default = (user, data, name = null, comment = null, folderId = null, force = false) => new Promise(async (resolve, reject) => {
    log(`registering ${name} (user: ${user.username})`);
    // File size
    const size = data.byteLength;
    log(`size is ${size}`);
    // File type
    let mime = 'application/octet-stream';
    const type = fileType(data);
    if (type !== null) {
        mime = type.mime;
        if (name === null) {
            name = `untitled.${type.ext}`;
        }
    }
    else {
        if (name === null) {
            name = 'untitled';
        }
    }
    log(`type is ${mime}`);
    // Generate hash
    const hash = crypto
        .createHash('sha256')
        .update(data)
        .digest('hex');
    log(`hash is ${hash}`);
    if (!force) {
        // Check if there is a file with the same hash
        const much = await drive_file_1.default.findOne({
            user_id: user._id,
            hash: hash
        });
        if (much !== null) {
            log('file with same hash is found');
            return resolve(much);
        }
        else {
            log('file with same hash is not found');
        }
    }
    // Calculate drive usage
    const usage = ((await drive_file_1.default
        .aggregate([
        { $match: { user_id: user._id } },
        { $project: {
                datasize: true
            } },
        { $group: {
                _id: null,
                usage: { $sum: '$datasize' }
            } }
    ]))[0] || {
        usage: 0
    }).usage;
    log(`drive usage is ${usage}`);
    // If usage limit exceeded
    if (usage + size > user.drive_capacity) {
        return reject('no-free-space');
    }
    // If the folder is specified
    let folder = null;
    if (folderId !== null) {
        folder = await drive_folder_1.default
            .findOne({
            _id: folderId,
            user_id: user._id
        });
        if (folder === null) {
            return reject('folder-not-found');
        }
    }
    let properties = null;
    // If the file is an image
    if (/^image\/.*$/.test(mime)) {
        // Calculate width and height to save in property
        const g = gm(data, name);
        const size = await prominence(g).size();
        properties = {
            width: size.width,
            height: size.height
        };
        log('image width and height is calculated');
    }
    // Create DriveFile document
    const file = await drive_file_1.default.insert({
        created_at: new Date(),
        user_id: user._id,
        folder_id: folder !== null ? folder._id : null,
        data: data,
        datasize: size,
        type: mime,
        name: name,
        comment: comment,
        hash: hash,
        properties: properties
    });
    delete file.data;
    log(`drive file has been created ${file._id}`);
    resolve(file);
    // Serialize
    const fileObj = await drive_file_2.default(file);
    // Publish drive_file_created event
    event_1.default(user._id, 'drive_file_created', fileObj);
    // Register to search database
    if (conf_1.default.elasticsearch.enable) {
        const es = require('../../db/elasticsearch');
        es.index({
            index: 'misskey',
            type: 'drive_file',
            id: file._id.toString(),
            body: {
                name: file.name,
                user_id: user._id.toString()
            }
        });
    }
});
