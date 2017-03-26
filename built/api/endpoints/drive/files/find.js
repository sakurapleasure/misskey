"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const drive_file_1 = require("../../../models/drive-file");
const drive_file_2 = require("../../../serializers/drive-file");
/**
 * Find a file(s)
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Get 'name' parameter
    const [name, nameErr] = cafy_1.default(params.name).string().$;
    if (nameErr)
        return rej('invalid name param');
    // Get 'folder_id' parameter
    const [folderId = null, folderIdErr] = cafy_1.default(params.folder_id).optional.nullable.id().$;
    if (folderIdErr)
        return rej('invalid folder_id param');
    // Issue query
    const files = await drive_file_1.default
        .find({
        name: name,
        user_id: user._id,
        folder_id: folderId
    }, {
        fields: {
            data: false
        }
    });
    // Serialize
    res(await Promise.all(files.map(async (file) => await drive_file_2.default(file))));
});
