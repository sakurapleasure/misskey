"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const following_1 = require("../models/following");
exports.default = async (me, includeMe = true) => {
    // Fetch relation to other users who the I follows
    // SELECT followee
    const myfollowing = await following_1.default
        .find({
        follower_id: me,
        // 削除されたドキュメントは除く
        deleted_at: { $exists: false }
    }, {
        fields: {
            followee_id: true
        }
    });
    // ID list of other users who the I follows
    const myfollowingIds = myfollowing.map(follow => follow.followee_id);
    if (includeMe) {
        myfollowingIds.push(me);
    }
    return myfollowingIds;
};
