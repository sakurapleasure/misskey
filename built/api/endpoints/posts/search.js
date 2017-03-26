"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const mongo = require("mongodb");
const cafy_1 = require("cafy");
const escapeRegexp = require('escape-regexp');
const post_1 = require("../../models/post");
const post_2 = require("../../serializers/post");
const conf_1 = require("../../../conf");
/**
 * Search a post
 *
 * @param {any} params
 * @param {any} me
 * @return {Promise<any>}
 */
module.exports = (params, me) => new Promise(async (res, rej) => {
    // Get 'query' parameter
    const [query, queryError] = cafy_1.default(params.query).string().pipe(x => x != '').$;
    if (queryError)
        return rej('invalid query param');
    // Get 'offset' parameter
    const [offset = 0, offsetErr] = cafy_1.default(params.offset).optional.number().min(0).$;
    if (offsetErr)
        return rej('invalid offset param');
    // Get 'max' parameter
    const [max = 10, maxErr] = cafy_1.default(params.max).optional.number().range(1, 30).$;
    if (maxErr)
        return rej('invalid max param');
    // If Elasticsearch is available, search by $
    // If not, search by MongoDB
    (conf_1.default.elasticsearch.enable ? byElasticsearch : byNative)(res, rej, me, query, offset, max);
});
// Search by MongoDB
async function byNative(res, rej, me, query, offset, max) {
    const escapedQuery = escapeRegexp(query);
    // Search posts
    const posts = await post_1.default
        .find({
        text: new RegExp(escapedQuery)
    }, {
        sort: {
            _id: -1
        },
        limit: max,
        skip: offset
    });
    // Serialize
    res(await Promise.all(posts.map(async (post) => await post_2.default(post, me))));
}
// Search by Elasticsearch
async function byElasticsearch(res, rej, me, query, offset, max) {
    const es = require('../../db/elasticsearch');
    es.search({
        index: 'misskey',
        type: 'post',
        body: {
            size: max,
            from: offset,
            query: {
                simple_query_string: {
                    fields: ['text'],
                    query: query,
                    default_operator: 'and'
                }
            },
            sort: [
                { _doc: 'desc' }
            ],
            highlight: {
                pre_tags: ['<mark>'],
                post_tags: ['</mark>'],
                encoder: 'html',
                fields: {
                    text: {}
                }
            }
        }
    }, async (error, response) => {
        if (error) {
            console.error(error);
            return res(500);
        }
        if (response.hits.total === 0) {
            return res([]);
        }
        const hits = response.hits.hits.map(hit => new mongo.ObjectID(hit._id));
        // Fetch found posts
        const posts = await post_1.default
            .find({
            _id: {
                $in: hits
            }
        }, {
            sort: {
                _id: -1
            }
        });
        posts.map(post => {
            post._highlight = response.hits.hits.filter(hit => post._id.equals(hit._id))[0].highlight.text[0];
        });
        // Serialize
        res(await Promise.all(posts.map(async (post) => await post_2.default(post, me))));
    });
}
