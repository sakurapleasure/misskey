"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const fs = require("fs");
const cafy_1 = require("cafy");
const drive_file_1 = require("../../../models/drive-file");
const drive_file_2 = require("../../../serializers/drive-file");
const add_file_to_drive_1 = require("../../../common/add-file-to-drive");
/**
 * Create a file
 *
 * @param {any} file
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (file, params, user) => new Promise(async (res, rej) => {
    if (file == null) {
        return rej('file is required');
    }
    const buffer = fs.readFileSync(file.path);
    fs.unlink(file.path, (err) => { if (err)
        console.log(err); });
    // Get 'name' parameter
    let name = file.originalname;
    if (name !== undefined && name !== null) {
        name = name.trim();
        if (name.length === 0) {
            name = null;
        }
        else if (name === 'blob') {
            name = null;
        }
        else if (!drive_file_1.validateFileName(name)) {
            return rej('invalid name');
        }
    }
    else {
        name = null;
    }
    // Get 'folder_id' parameter
    const [folderId = null, folderIdErr] = cafy_1.default(params.folder_id).optional.nullable.id().$;
    if (folderIdErr)
        return rej('invalid folder_id param');
    // Create file
    const driveFile = await add_file_to_drive_1.default(user, buffer, name, null, folderId);
    // Serialize
    const fileObj = await drive_file_2.default(driveFile);
    // Response
    res(fileObj);
});
