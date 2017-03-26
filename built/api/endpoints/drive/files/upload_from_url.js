"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const URL = require("url");
const download = require('download');
const cafy_1 = require("cafy");
const drive_file_1 = require("../../../models/drive-file");
const drive_file_2 = require("../../../serializers/drive-file");
const add_file_to_drive_1 = require("../../../common/add-file-to-drive");
/**
 * Create a file from a URL
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Get 'url' parameter
    // TODO: Validate this url
    const [url, urlErr] = cafy_1.default(params.url).string().$;
    if (urlErr)
        return rej('invalid url param');
    let name = URL.parse(url).pathname.split('/').pop();
    if (!drive_file_1.validateFileName(name)) {
        name = null;
    }
    // Get 'folder_id' parameter
    const [folderId = null, folderIdErr] = cafy_1.default(params.folder_id).optional.nullable.id().$;
    if (folderIdErr)
        return rej('invalid folder_id param');
    // Download file
    const data = await download(url);
    // Create file
    const driveFile = await add_file_to_drive_1.default(user, data, name, null, folderId);
    // Serialize
    const fileObj = await drive_file_2.default(driveFile);
    // Response
    res(fileObj);
});
