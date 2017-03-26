/**
 * Misskey Entry Point!
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Error.stackTraceLimit = Infinity;
/**
 * Module dependencies
 */
const fs = require("fs");
const os = require("os");
const cluster = require("cluster");
const debug = require("debug");
const logger_1 = require("./utils/logger");
const chalk = require("chalk");
//import portUsed = require('tcp-port-used');
const isRoot = require("is-root");
const progressbar_1 = require("./utils/cli/progressbar");
const environmentInfo_1 = require("./utils/environmentInfo");
const machineInfo_1 = require("./utils/machineInfo");
const dependencyInfo_1 = require("./utils/dependencyInfo");
const config_1 = require("./config");
const config_2 = require("./config");
const clusterLog = debug('misskey:cluster');
var InitResult;
(function (InitResult) {
    InitResult[InitResult["Success"] = 0] = "Success";
    InitResult[InitResult["Warn"] = 1] = "Warn";
    InitResult[InitResult["Failure"] = 2] = "Failure";
})(InitResult || (InitResult = {}));
process.title = 'Misskey';
// Start app
main();
/**
 * Init process
 */
function main() {
    if (cluster.isMaster) {
        masterMain();
    }
    else {
        workerMain();
    }
}
/**
 * Init master process
 */
async function masterMain() {
    let initResult;
    try {
        // initialize app
        initResult = await init();
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
    switch (initResult) {
        case InitResult.Success:
            logger_1.default.info(chalk.green('Successfully initialized :)'));
            break;
        case InitResult.Warn:
            logger_1.default.warn(chalk.yellow('Initialized with some problem(s) :|'));
            break;
        case InitResult.Failure:
            logger_1.default.error(chalk.red('Fatal error occurred during initializing :('));
            process.exit();
            return;
    }
    spawnWorkers(() => {
        logger_1.default.info(chalk.bold.green(`Now listening on port ${config_2.default().port}`));
    });
}
/**
 * Init worker process
 */
function workerMain() {
    // start server
    require('./server');
}
/**
 * Init app
 */
async function init() {
    let warn = false;
    logger_1.default.info('Welcome to Misskey!');
    logger_1.default.info(chalk.bold('Misskey <aoi>'));
    logger_1.default.info('Initializing...');
    environmentInfo_1.default.show();
    machineInfo_1.default.show();
    new dependencyInfo_1.default().showAll();
    let configLogger = new logger_1.default('Config');
    if (!fs.existsSync(config_1.path)) {
        configLogger.error('Configuration not found');
        return InitResult.Failure;
    }
    const config = config_2.default();
    configLogger.info('Successfully loaded');
    configLogger.info(`maintainer: ${config.maintainer}`);
    if (process.platform === 'linux' && !isRoot() && config.port < 1024) {
        logger_1.default.error('You need root privileges to listen on port below 1024 on Linux');
        return InitResult.Failure;
    }
    // Check if a port is being used
    /* https://github.com/stdarg/tcp-port-used/issues/3
    if (await portUsed.check(config.port)) {
        Logger.error(`Port ${config.port} is already used`);
        return InitResult.Failure;
    }
    */
    // Try to connect to MongoDB
    let mongoDBLogger = new logger_1.default('MongoDB');
    try {
        const db = require('./db/mongodb').default;
        mongoDBLogger.info('Successfully connected');
        db.close();
    }
    catch (e) {
        mongoDBLogger.error(e);
        return InitResult.Failure;
    }
    return warn ? InitResult.Warn : InitResult.Success;
}
function spawnWorkers(onComplete) {
    // Count the machine's CPUs
    const cpuCount = os.cpus().length;
    const progress = new progressbar_1.default(cpuCount, 'Starting workers');
    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i++) {
        const worker = cluster.fork();
        worker.on('message', message => {
            if (message === 'ready') {
                progress.increment();
            }
        });
    }
    // On all workers started
    progress.on('complete', () => {
        onComplete();
    });
}
// Listen new workers
cluster.on('fork', worker => {
    clusterLog(`Process forked: [${worker.id}]`);
});
// Listen online workers
cluster.on('online', worker => {
    clusterLog(`Process is now online: [${worker.id}]`);
});
// Listen for dying workers
cluster.on('exit', worker => {
    // Replace the dead worker,
    // we're not sentimental
    clusterLog(chalk.red(`[${worker.id}] died :(`));
    cluster.fork();
});
// Display detail of unhandled promise rejection
process.on('unhandledRejection', console.dir);
// Dying away...
process.on('exit', () => {
    logger_1.default.info('The process is going exit');
});
