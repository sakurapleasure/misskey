/**
 * Core Server
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const http = require("http");
const https = require("https");
const cluster = require("cluster");
const express = require("express");
const morgan = require("morgan");
const vhost = require("vhost");
const conf_1 = require("./conf");
/**
 * Init app
 */
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 'loopback');
// Log
app.use(morgan(process.env.NODE_ENV == 'production' ? 'combined' : 'dev', {
    // create a write stream (in append mode)
    stream: conf_1.default.accesslog ? fs.createWriteStream(conf_1.default.accesslog) : null
}));
// Drop request that without 'Host' header
app.use((req, res, next) => {
    if (!req.headers['host']) {
        res.sendStatus(400);
    }
    else {
        next();
    }
});
/**
 * Register modules
 */
app.use(vhost(`api.${conf_1.default.host}`, require('./api/server')));
app.use(vhost(conf_1.default.secondary_host, require('./himasaku/server')));
app.use(vhost(`file.${conf_1.default.secondary_host}`, require('./file/server')));
app.use(require('./web/server'));
/**
 * Create server
 */
const server = conf_1.default.https.enable ?
    https.createServer({
        key: fs.readFileSync(conf_1.default.https.key),
        cert: fs.readFileSync(conf_1.default.https.cert),
        ca: fs.readFileSync(conf_1.default.https.ca)
    }, app) :
    http.createServer(app);
/**
 * Steaming
 */
require('./api/streaming')(server);
/**
 * Server listen
 */
server.listen(conf_1.default.port, () => {
    if (cluster.isWorker) {
        // Send a 'ready' message to parent process
        process.send('ready');
    }
});
/**
 * Export app for testing
 */
module.exports = app;
