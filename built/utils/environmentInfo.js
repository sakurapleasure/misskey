"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
class default_1 {
    static show() {
        const env = process.env.NODE_ENV;
        let logger = new logger_1.default('Env');
        logger.info(typeof env == 'undefined' ? 'NODE_ENV is not set' : `NODE_ENV: ${env}`);
        if (env !== 'production') {
            logger.warn('The environment is not in production mode');
            logger.warn('Do not use for production purpose');
        }
    }
}
exports.default = default_1;
