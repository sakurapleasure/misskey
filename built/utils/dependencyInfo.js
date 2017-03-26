"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const child_process_1 = require("child_process");
class default_1 {
    constructor() {
        this.logger = new logger_1.default('Deps');
    }
    showAll() {
        this.show('MongoDB', 'mongo --version', x => x.match(/^MongoDB shell version:? (.*)\r?\n/));
        this.show('Redis', 'redis-server --version', x => x.match(/v=([0-9\.]*)/));
        this.show('GraphicsMagick', 'gm -version', x => x.match(/^GraphicsMagick ([0-9\.]*) .*/));
    }
    show(serviceName, command, transform) {
        try {
            // ステータス0以外のときにexecSyncはstderrをコンソール上に出力してしまうので
            // プロセスからのstderrをすべて無視するように stdio オプションをセット
            const x = child_process_1.execSync(command, { stdio: ['pipe', 'pipe', 'ignore'] });
            const ver = transform(x.toString());
            if (ver != null) {
                this.logger.info(`${serviceName} ${ver[1]} found`);
            }
            else {
                this.logger.warn(`${serviceName} not found`);
                this.logger.warn(`Regexp used for version check of ${serviceName} is probably messed up`);
            }
        }
        catch (e) {
            this.logger.warn(`${serviceName} not found`);
        }
    }
}
exports.default = default_1;
