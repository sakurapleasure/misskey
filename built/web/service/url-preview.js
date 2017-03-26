"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const summaly_1 = require("summaly");
module.exports = async (req, res) => {
    const summary = await summaly_1.default(req.query.url);
    summary.icon = wrap(summary.icon);
    summary.thumbnail = wrap(summary.thumbnail);
    res.send(summary);
};
function wrap(url) {
    return url != null
        ? `https://images.weserv.nl/?url=${url.replace(/^https?:\/\//, '')}`
        : null;
}
