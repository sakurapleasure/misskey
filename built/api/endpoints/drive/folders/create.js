"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const drive_folder_1 = require("../../../models/drive-folder");
const drive_folder_2 = require("../../../models/drive-folder");
const drive_folder_3 = require("../../../serializers/drive-folder");
const event_1 = require("../../../event");
/**
 * Create drive folder
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Get 'name' parameter
    const [name = '無題のフォルダー', nameErr] = cafy_1.default(params.name).optional.string().pipe(drive_folder_2.isValidFolderName).$;
    if (nameErr)
        return rej('invalid name param');
    // Get 'parent_id' parameter
    const [parentId = null, parentIdErr] = cafy_1.default(params.parent_id).optional.nullable.id().$;
    if (parentIdErr)
        return rej('invalid parent_id param');
    // If the parent folder is specified
    let parent = null;
    if (parentId) {
        // Fetch parent folder
        parent = await drive_folder_1.default
            .findOne({
            _id: parentId,
            user_id: user._id
        });
        if (parent === null) {
            return rej('parent-not-found');
        }
    }
    // Create folder
    const folder = await drive_folder_1.default.insert({
        created_at: new Date(),
        name: name,
        parent_id: parent !== null ? parent._id : null,
        user_id: user._id
    });
    // Serialize
    const folderObj = await drive_folder_3.default(folder);
    // Response
    res(folderObj);
    // Publish drive_folder_created event
    event_1.default(user._id, 'drive_folder_created', folderObj);
});
