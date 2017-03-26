"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const xml2json = require("xml2json");
module.exports = (req, res) => {
    const url = req.body.url;
    request(url, (err, response, xml) => {
        if (err) {
            res.sendStatus(500);
        }
        else {
            res.send(xml2json.toJson(xml));
        }
    });
};
