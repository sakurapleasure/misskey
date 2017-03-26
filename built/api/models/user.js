"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../../db/mongodb");
const collection = mongodb_1.default.get('users');
collection.index('username'); // fuck type definition
collection.index('token'); // fuck type definition
exports.default = collection; // fuck type definition
function validateUsername(username) {
    return typeof username == 'string' && /^[a-zA-Z0-9\-]{3,20}$/.test(username);
}
exports.validateUsername = validateUsername;
function validatePassword(password) {
    return typeof password == 'string' && password != '';
}
exports.validatePassword = validatePassword;
function isValidName(name) {
    return typeof name == 'string' && name.length < 30 && name.trim() != '';
}
exports.isValidName = isValidName;
function isValidDescription(description) {
    return typeof description == 'string' && description.length < 500 && description.trim() != '';
}
exports.isValidDescription = isValidDescription;
function isValidLocation(location) {
    return typeof location == 'string' && location.length < 50 && location.trim() != '';
}
exports.isValidLocation = isValidLocation;
function isValidBirthday(birthday) {
    return typeof birthday == 'string' && /^([0-9]{4})\-([0-9]{2})-([0-9]{2})$/.test(birthday);
}
exports.isValidBirthday = isValidBirthday;
