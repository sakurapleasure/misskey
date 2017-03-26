"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ms = require("ms");
exports.default = (name) => (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/app/${name}/view.html`), {
        maxAge: ms('7 days')
    });
};
