/**
 * Config loader
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const URL = require("url");
const yaml = require("js-yaml");
const isUrl = require("is-url");
/**
 * Path of configuration directory
 */
const dir = `${__dirname}/../.config`;
/**
 * Path of configuration file
 */
exports.path = process.env.NODE_ENV == 'test'
    ? `${dir}/test.yml`
    : `${dir}/default.yml`;
function load() {
    const config = yaml.safeLoad(fs.readFileSync(exports.path, 'utf-8'));
    const mixin = {};
    // Validate URLs
    if (!isUrl(config.url))
        urlError(config.url);
    if (!isUrl(config.secondary_url))
        urlError(config.secondary_url);
    const url = URL.parse(config.url);
    const head = url.host.split('.')[0];
    if (head != 'misskey') {
        console.error(`プライマリドメインは、必ず「misskey」ドメインで始まっていなければなりません(現在の設定では「${head}」で始まっています)。例えば「https://misskey.xyz」「http://misskey.my.app.example.com」などが正しいプライマリURLです。`);
        process.exit();
    }
    config.url = normalizeUrl(config.url);
    config.secondary_url = normalizeUrl(config.secondary_url);
    mixin.host = config.url.substr(config.url.indexOf('://') + 3);
    mixin.scheme = config.url.substr(0, config.url.indexOf('://'));
    mixin.secondary_host = config.secondary_url.substr(config.secondary_url.indexOf('://') + 3);
    mixin.secondary_scheme = config.secondary_url.substr(0, config.secondary_url.indexOf('://'));
    mixin.api_url = `${mixin.scheme}://api.${mixin.host}`;
    mixin.auth_url = `${mixin.scheme}://auth.${mixin.host}`;
    mixin.dev_url = `${mixin.scheme}://dev.${mixin.host}`;
    mixin.about_url = `${mixin.scheme}://about.${mixin.host}`;
    mixin.drive_url = `${mixin.secondary_scheme}://file.${mixin.secondary_host}`;
    return Object.assign(config, mixin);
}
exports.default = load;
function normalizeUrl(url) {
    return url[url.length - 1] === '/' ? url.substr(0, url.length - 1) : url;
}
function urlError(url) {
    console.error(`「${url}」は、正しいURLではありません。先頭に http:// または https:// をつけ忘れてないかなど確認してください。`);
    process.exit();
}
