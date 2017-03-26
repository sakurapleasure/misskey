"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const mongo = require("mongodb");
const deepcopy = require("deepcopy");
const messaging_message_1 = require("../models/messaging-message");
const user_1 = require("./user");
const drive_file_1 = require("./drive-file");
const text_1 = require("../common/text");
/**
 * Serialize a message
 *
 * @param {any} message
 * @param {any} me?
 * @param {any} options?
 * @return {Promise<any>}
 */
exports.default = (message, me, options) => new Promise(async (resolve, reject) => {
    const opts = options || {
        populateRecipient: true
    };
    let _message;
    // Populate the message if 'message' is ID
    if (mongo.ObjectID.prototype.isPrototypeOf(message)) {
        _message = await messaging_message_1.default.findOne({
            _id: message
        });
    }
    else if (typeof message === 'string') {
        _message = await messaging_message_1.default.findOne({
            _id: new mongo.ObjectID(message)
        });
    }
    else {
        _message = deepcopy(message);
    }
    // Rename _id to id
    _message.id = _message._id;
    delete _message._id;
    // Parse text
    if (_message.text) {
        _message.ast = text_1.default(_message.text);
    }
    // Populate user
    _message.user = await user_1.default(_message.user_id, me);
    if (_message.file) {
        // Populate file
        _message.file = await drive_file_1.default(_message.file_id);
    }
    if (opts.populateRecipient) {
        // Populate recipient
        _message.recipient = await user_1.default(_message.recipient_id, me);
    }
    resolve(_message);
});
