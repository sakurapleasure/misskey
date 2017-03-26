/**
 * API Server
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
// import authenticate from './authenticate';
const endpoints_1 = require("./endpoints");
/**
 * Init app
 */
const app = express();
app.disable('x-powered-by');
app.set('etag', false);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
    type: ['application/json', 'text/plain']
}));
app.use(cors({
    origin: true
}));
app.get('/', (req, res) => {
    res.send('YEE HAW');
});
/**
 * Register endpoint handlers
 */
endpoints_1.default.forEach(endpoint => endpoint.withFile ?
    app.post('/' + endpoint.name, endpoint.withFile ? multer({ dest: 'uploads/' }).single('file') : null, require('./api-handler').default.bind(null, endpoint)) :
    app.post('/' + endpoint.name, require('./api-handler').default.bind(null, endpoint)));
app.post('/signup', require('./private/signup').default);
app.post('/signin', require('./private/signin').default);
app.use((req, res, next) => {
    res.locals.user = ((req.headers['cookie'] || '').match(/i=(!\w+)/) || [null, null])[1];
    next();
});
require('./service/github')(app);
require('./service/twitter')(app);
module.exports = app;
