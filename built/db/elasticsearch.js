"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch = require("elasticsearch");
const conf_1 = require("../conf");
// Init ElasticSearch connection
const client = new elasticsearch.Client({
    host: `${conf_1.default.elasticsearch.host}:${conf_1.default.elasticsearch.port}`
});
// Send a HEAD request
client.ping({
    // Ping usually has a 3000ms timeout
    requestTimeout: Infinity,
    // Undocumented params are appended to the query string
    hello: 'elasticsearch!'
}, error => {
    if (error) {
        console.error('elasticsearch is down!');
    }
});
exports.default = client;
