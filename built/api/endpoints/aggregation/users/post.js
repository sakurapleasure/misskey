"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const user_1 = require("../../../models/user");
const post_1 = require("../../../models/post");
/**
 * Aggregate post of a user
 *
 * @param {any} params
 * @return {Promise<any>}
 */
module.exports = (params) => new Promise(async (res, rej) => {
    // Get 'user_id' parameter
    const [userId, userIdErr] = cafy_1.default(params.user_id).id().$;
    if (userIdErr)
        return rej('invalid user_id param');
    // Lookup user
    const user = await user_1.default.findOne({
        _id: userId
    }, {
        fields: {
            _id: true
        }
    });
    if (user === null) {
        return rej('user not found');
    }
    const datas = await post_1.default
        .aggregate([
        { $match: { user_id: user._id } },
        { $project: {
                repost_id: '$repost_id',
                reply_to_id: '$reply_to_id',
                created_at: { $add: ['$created_at', 9 * 60 * 60 * 1000] } // Convert into JST
            } },
        { $project: {
                date: {
                    year: { $year: '$created_at' },
                    month: { $month: '$created_at' },
                    day: { $dayOfMonth: '$created_at' }
                },
                type: {
                    $cond: {
                        if: { $ne: ['$repost_id', null] },
                        then: 'repost',
                        else: {
                            $cond: {
                                if: { $ne: ['$reply_to_id', null] },
                                then: 'reply',
                                else: 'post'
                            }
                        }
                    }
                }
            }
        },
        { $group: { _id: {
                    date: '$date',
                    type: '$type'
                }, count: { $sum: 1 } } },
        { $group: {
                _id: '$_id.date',
                data: { $addToSet: {
                        type: '$_id.type',
                        count: '$count'
                    } }
            } }
    ]);
    datas.forEach(data => {
        data.date = data._id;
        delete data._id;
        data.posts = (data.data.filter(x => x.type == 'post')[0] || { count: 0 }).count;
        data.reposts = (data.data.filter(x => x.type == 'repost')[0] || { count: 0 }).count;
        data.replies = (data.data.filter(x => x.type == 'reply')[0] || { count: 0 }).count;
        delete data.data;
    });
    const graph = [];
    for (let i = 0; i < 30; i++) {
        let day = new Date(new Date().setDate(new Date().getDate() - i));
        const data = datas.filter(d => d.date.year == day.getFullYear() && d.date.month == day.getMonth() + 1 && d.date.day == day.getDate())[0];
        if (data) {
            graph.push(data);
        }
        else {
            graph.push({
                date: {
                    year: day.getFullYear(),
                    month: day.getMonth() + 1,
                    day: day.getDate()
                },
                posts: 0,
                reposts: 0,
                replies: 0
            });
        }
    }
    res(graph);
});
