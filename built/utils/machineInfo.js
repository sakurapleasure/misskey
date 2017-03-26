"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const logger_1 = require("./logger");
class default_1 {
    static show() {
        const totalmem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
        const freemem = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
        let logger = new logger_1.default('Machine');
        logger.info(`Hostname: ${os.hostname()}`);
        logger.info(`Platform: ${process.platform}`);
        logger.info(`Architecture: ${process.arch}`);
        logger.info(`Node.js: ${process.version}`);
        logger.info(`CPU: ${os.cpus().length}core`);
        logger.info(`MEM: ${totalmem}GB (available: ${freemem}GB)`);
    }
}
exports.default = default_1;
