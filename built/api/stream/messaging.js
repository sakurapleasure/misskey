"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const messaging_message_1 = require("../models/messaging-message");
const event_1 = require("../event");
function messagingStream(request, connection, subscriber, user) {
    const otherparty = request.resourceURL.query.otherparty;
    // Subscribe messaging stream
    subscriber.subscribe(`misskey:messaging-stream:${user._id}-${otherparty}`);
    subscriber.on('message', (_, data) => {
        connection.send(data);
    });
    connection.on('message', async (data) => {
        const msg = JSON.parse(data.utf8Data);
        switch (msg.type) {
            case 'read':
                if (!msg.id) {
                    return;
                }
                const id = new mongodb.ObjectID(msg.id);
                // Fetch message
                // SELECT _id, user_id, is_read
                const message = await messaging_message_1.default.findOne({
                    _id: id,
                    recipient_id: user._id
                }, {
                    fields: {
                        _id: true,
                        user_id: true,
                        is_read: true
                    }
                });
                if (message == null) {
                    return;
                }
                if (message.is_read) {
                    return;
                }
                // Update documents
                await messaging_message_1.default.update({
                    _id: id
                }, {
                    $set: { is_read: true }
                });
                // Publish event
                event_1.publishMessagingStream(message.user_id, user._id, 'read', id.toString());
                break;
        }
    });
}
exports.default = messagingStream;
