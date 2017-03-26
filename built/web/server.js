/**
 * Web Server
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ms = require("ms");
// express modules
const express = require("express");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const compression = require("compression");
const subdomain = require('subdomain');
const serve_app_1 = require("./serve-app");
const conf_1 = require("../conf");
/**
 * Init app
 */
const app = express();
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
    type: ['application/json', 'text/plain']
}));
app.use(compression());
/**
 * Initialize requests
 */
app.use((req, res, next) => {
    res.header('X-Frame-Options', 'DENY');
    next();
});
/**
 * Static assets
 */
app.use(favicon(`${__dirname}/assets/favicon.ico`));
app.get('/manifest.json', (req, res) => res.sendFile(__dirname + '/assets/manifest.json'));
app.get('/apple-touch-icon.png', (req, res) => res.sendFile(__dirname + '/assets/apple-touch-icon.png'));
app.use('/assets', express.static(`${__dirname}/assets`, {
    maxAge: ms('7 days')
}));
/**
 * Common API
 */
app.get(/\/api:url/, require('./service/url-preview'));
app.post(/\/api:rss/, require('./service/rss-proxy'));
/**
 * Serve config
 */
app.get('/config.json', (req, res) => {
    res.send({
        recaptcha: {
            siteKey: conf_1.default.recaptcha.siteKey
        }
    });
});
/**
 * Subdomain
 */
app.use(subdomain({
    base: conf_1.default.host,
    prefix: '@'
}));
/**
 * Routing
 */
app.use(require('./about')); // about docs
app.get('/@/auth/*', serve_app_1.default('auth')); // authorize form
app.get('/@/dev/*', serve_app_1.default('dev')); // developer center
app.get('*', serve_app_1.default('client')); // client
module.exports = app;
