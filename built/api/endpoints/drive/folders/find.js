"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const drive_folder_1 = require("../../../models/drive-folder");
const drive_folder_2 = require("../../../serializers/drive-folder");
/**
 * Find a folder(s)
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
    // Get 'parent_id' parameter
    const [parentId = null, parentIdErr] = cafy_1.default(params.parent_id).optional.nullable.id().$;
    if (parentIdErr)
        return rej('invalid parent_id param');
    // Issue query
    const folders = await drive_folder_1.default
        .find({
        name: name,
        user_id: user._id,
        parent_id: parentId
    });
    // Serialize
    res(await Promise.all(folders.map(async (folder) => await drive_folder_2.default(folder))));
});
