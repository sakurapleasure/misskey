"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const drive_file_1 = require("../../../models/drive-file");
const drive_file_2 = require("../../../serializers/drive-file");
/**
 * Show a file
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
    // Serialize
    res(await drive_file_2.default(file, {
        detail: true
    }));
});
