/**
 * Code (inline)
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syntax_highlighter_1 = require("../core/syntax-highlighter");
module.exports = text => {
    const match = text.match(/^`(.+?)`/);
    if (!match)
        return null;
    const code = match[0];
    return {
        type: 'inline-code',
        content: code,
        code: code.substr(1, code.length - 2).trim(),
        html: syntax_highlighter_1.default(code.substr(1, code.length - 2).trim())
    };
};
