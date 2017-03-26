"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const drive_folder_1 = require("../../../models/drive-folder");
const drive_folder_2 = require("../../../serializers/drive-folder");
/**
 * Show a folder
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Get 'folder_id' parameter
    const [folderId, folderIdErr] = cafy_1.default(params.folder_id).id().$;
    if (folderIdErr)
        return rej('invalid folder_id param');
    // Get folder
    const folder = await drive_folder_1.default
        .findOne({
        _id: folderId,
        user_id: user._id
    });
    if (folder === null) {
        return rej('folder-not-found');
    }
    // Serialize
    res(await drive_folder_2.default(folder, {
        detail: true
    }));
});
