"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const drive_file_1 = require("../models/drive-file");
/**
 * Get drive information
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Calculate drive usage
    const usage = ((await drive_file_1.default
        .aggregate([
        { $match: { user_id: user._id } },
        {
            $project: {
                datasize: true
            }
        },
        {
            $group: {
                _id: null,
                usage: { $sum: '$datasize' }
            }
        }
    ]))[0] || {
        usage: 0
    }).usage;
    res({
        capacity: user.drive_capacity,
        usage: usage
    });
});
