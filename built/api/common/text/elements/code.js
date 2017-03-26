/**
 * Code (block)
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syntax_highlighter_1 = require("../core/syntax-highlighter");
module.exports = text => {
    const match = text.match(/^```([\s\S]+?)```/);
    if (!match)
        return null;
    const code = match[0];
    return {
        type: 'code',
        content: code,
        code: code.substr(3, code.length - 6).trim(),
        html: syntax_highlighter_1.default(code.substr(3, code.length - 6).trim())
    };
};
