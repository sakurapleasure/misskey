"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const messaging_message_1 = require("../../../models/messaging-message");
const messaging_message_2 = require("../../../models/messaging-message");
const messaging_history_1 = require("../../../models/messaging-history");
const user_1 = require("../../../models/user");
const drive_file_1 = require("../../../models/drive-file");
const messaging_message_3 = require("../../../serializers/messaging-message");
const event_1 = require("../../../event");
const event_2 = require("../../../event");
const conf_1 = require("../../../../conf");
/**
 * Create a message
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
    // Get 'user_id' parameter
    const [recipientId, recipientIdErr] = cafy_1.default(params.user_id).id().$;
    if (recipientIdErr)
        return rej('invalid user_id param');
    // Myself
    if (recipientId.equals(user._id)) {
        return rej('cannot send message to myself');
    }
    // Fetch recipient
    const recipient = await user_1.default.findOne({
        _id: recipientId
    }, {
        fields: {
            _id: true
        }
    });
    if (recipient === null) {
        return rej('user not found');
    }
    // Get 'text' parameter
    const [text, textErr] = cafy_1.default(params.text).optional.string().pipe(messaging_message_2.isValidText).$;
    if (textErr)
        return rej('invalid text');
    // Get 'file_id' parameter
    const [fileId, fileIdErr] = cafy_1.default(params.file_id).optional.id().$;
    if (fileIdErr)
        return rej('invalid file_id param');
    let file = null;
    if (fileId !== undefined) {
        file = await drive_file_1.default.findOne({
            _id: fileId,
            user_id: user._id
        }, {
            data: false
        });
        if (file === null) {
            return rej('file not found');
        }
    }
    // テキストが無いかつ添付ファイルも無かったらエラー
    if (text === undefined && file === null) {
        return rej('text or file is required');
    }
    // メッセージを作成
    const message = await messaging_message_1.default.insert({
        created_at: new Date(),
        file_id: file ? file._id : undefined,
        recipient_id: recipient._id,
        text: text ? text : undefined,
        user_id: user._id,
        is_read: false
    });
    // Serialize
    const messageObj = await messaging_message_3.default(message);
    // Reponse
    res(messageObj);
    // 自分のストリーム
    event_2.publishMessagingStream(message.user_id, message.recipient_id, 'message', messageObj);
    event_1.default(message.user_id, 'messaging_message', messageObj);
    // 相手のストリーム
    event_2.publishMessagingStream(message.recipient_id, message.user_id, 'message', messageObj);
    event_1.default(message.recipient_id, 'messaging_message', messageObj);
    // 5秒経っても(今回作成した)メッセージが既読にならなかったら「未読のメッセージがありますよ」イベントを発行する
    setTimeout(async () => {
        const freshMessage = await messaging_message_1.default.findOne({ _id: message._id }, { is_read: true });
        if (!freshMessage.is_read) {
            event_1.default(message.recipient_id, 'unread_messaging_message', messageObj);
        }
    }, 5000);
    // Register to search database
    if (message.text && conf_1.default.elasticsearch.enable) {
        const es = require('../../../db/elasticsearch');
        es.index({
            index: 'misskey',
            type: 'messaging_message',
            id: message._id.toString(),
            body: {
                text: message.text
            }
        });
    }
    // 履歴作成(自分)
    messaging_history_1.default.update({
        user_id: user._id,
        partner: recipient._id
    }, {
        updated_at: new Date(),
        user_id: user._id,
        partner: recipient._id,
        message: message._id
    }, {
        upsert: true
    });
    // 履歴作成(相手)
    messaging_history_1.default.update({
        user_id: recipient._id,
        partner: user._id
    }, {
        updated_at: new Date(),
        user_id: recipient._id,
        partner: user._id,
        message: message._id
    }, {
        upsert: true
    });
});
