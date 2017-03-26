"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const drive_folder_1 = require("../../../models/drive-folder");
const drive_folder_2 = require("../../../models/drive-folder");
const drive_file_1 = require("../../../serializers/drive-file");
const event_1 = require("../../../event");
/**
 * Update a folder
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
    // Fetch folder
    const folder = await drive_folder_1.default
        .findOne({
        _id: folderId,
        user_id: user._id
    });
    if (folder === null) {
        return rej('folder-not-found');
    }
    // Get 'name' parameter
    const [name, nameErr] = cafy_1.default(params.name).optional.string().pipe(drive_folder_2.isValidFolderName).$;
    if (nameErr)
        return rej('invalid name param');
    if (name)
        folder.name = name;
    // Get 'parent_id' parameter
    const [parentId, parentIdErr] = cafy_1.default(params.parent_id).optional.nullable.id().$;
    if (parentIdErr)
        return rej('invalid parent_id param');
    if (parentId !== undefined) {
        if (parentId === null) {
            folder.parent_id = null;
        }
        else {
            // Get parent folder
            const parent = await drive_folder_1.default
                .findOne({
                _id: parentId,
                user_id: user._id
            });
            if (parent === null) {
                return rej('parent-folder-not-found');
            }
            // Check if the circular reference will occur
            async function checkCircle(folderId) {
                // Fetch folder
                const folder2 = await drive_folder_1.default.findOne({
                    _id: folderId
                }, {
                    _id: true,
                    parent_id: true
                });
                if (folder2._id.equals(folder._id)) {
                    return true;
                }
                else if (folder2.parent_id) {
                    return await checkCircle(folder2.parent_id);
                }
                else {
                    return false;
                }
            }
            if (parent.parent_id !== null) {
                if (await checkCircle(parent.parent_id)) {
                    return rej('detected-circular-definition');
                }
            }
            folder.parent_id = parent._id;
        }
    }
    // Update
    drive_folder_1.default.update(folder._id, {
        $set: {
            name: folder.name,
            parent_id: folder.parent_id
        }
    });
    // Serialize
    const folderObj = await drive_file_1.default(folder);
    // Response
    res(folderObj);
    // Publish drive_folder_updated event
    event_1.default(user._id, 'drive_folder_updated', folderObj);
});
