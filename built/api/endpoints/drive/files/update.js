"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const drive_folder_1 = require("../../../models/drive-folder");
const drive_file_1 = require("../../../models/drive-file");
const drive_file_2 = require("../../../models/drive-file");
const drive_file_3 = require("../../../serializers/drive-file");
const event_1 = require("../../../event");
/**
 * Update a file
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Get 'file_id' parameter
    const [fileId, fileIdErr] = cafy_1.default(params.file_id).id().$;
    if (fileIdErr)
        return rej('invalid file_id param');
    // Fetch file
    const file = await drive_file_1.default
        .findOne({
        _id: fileId,
        user_id: user._id
    }, {
        fields: {
            data: false
        }
    });
    if (file === null) {
        return rej('file-not-found');
    }
    // Get 'name' parameter
    const [name, nameErr] = cafy_1.default(params.name).optional.string().pipe(drive_file_2.validateFileName).$;
    if (nameErr)
        return rej('invalid name param');
    if (name)
        file.name = name;
    // Get 'folder_id' parameter
    const [folderId, folderIdErr] = cafy_1.default(params.folder_id).optional.nullable.id().$;
    if (folderIdErr)
        return rej('invalid folder_id param');
    if (folderId !== undefined) {
        if (folderId === null) {
            file.folder_id = null;
        }
        else {
            // Fetch folder
            const folder = await drive_folder_1.default
                .findOne({
                _id: folderId,
                user_id: user._id
            });
            if (folder === null) {
                return rej('folder-not-found');
            }
            file.folder_id = folder._id;
        }
    }
    drive_file_1.default.update(file._id, {
        $set: {
            name: file.name,
            folder_id: file.folder_id
        }
    });
    // Serialize
    const fileObj = await drive_file_3.default(file);
    // Response
    res(fileObj);
    // Publish drive_file_updated event
    event_1.default(user._id, 'drive_file_updated', fileObj);
});
