"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageResolvers = void 0;
const message_1 = require("../../schema/message");
const user_1 = require("../../schema/user");
const email_1 = require("../../utils/email");
const uuid_1 = require("uuid");
exports.messageResolvers = {
    Query: {
        getMessages: async (args, context) => {
            if (!context.user)
                throw new Error('Authentication required');
            return await message_1.MessageModel.find({
                $or: [
                    { recipientId: context.userId, sendToAll: false },
                    { sendToAll: true }
                ]
            })
                .populate('senderId')
                .sort({ sentDate: -1 });
        },
        getMessageById: async (args, context) => {
            return await message_1.MessageModel.findByIdAndUpdate(args.id, { $addToSet: { readBy: context.userId } }, { new: true }).populate('senderId');
        }
    },
    Mutation: {
        sendMessage: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            try {
                const messageId = (0, uuid_1.v4)();
                const message = new message_1.MessageModel({
                    messageId,
                    senderId: context.userId,
                    recipientId: args.recipientId,
                    sendToAll: args.sendToAll || false,
                    title: args.title,
                    content: args.content,
                    imageUrl: args.imageUrl,
                    status: 'sent'
                });
                const savedMessage = await message.save();
                // Send emails
                if (args.sendToAll) {
                    const members = await user_1.UserModel.find({ role: 'member' });
                    for (const member of members) {
                        await (0, email_1.sendMessageToMember)({
                            email: member.email,
                            name: member.name,
                            messageTitle: args.title,
                            messageContent: args.content,
                            imageUrl: args.imageUrl
                        });
                    }
                }
                else {
                    const recipient = await user_1.UserModel.findById(args.recipientId);
                    if (recipient) {
                        await (0, email_1.sendMessageToMember)({
                            email: recipient.email,
                            name: recipient.name,
                            messageTitle: args.title,
                            messageContent: args.content,
                            imageUrl: args.imageUrl
                        });
                    }
                }
                return { ...savedMessage.toObject(), success: true };
            }
            catch (error) {
                throw new Error(`Failed to send message: ${error.message}`);
            }
        },
        scheduleMessage: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            const messageId = (0, uuid_1.v4)();
            const message = new message_1.MessageModel({
                messageId,
                senderId: context.userId,
                recipientId: args.recipientId,
                sendToAll: args.sendToAll || false,
                title: args.title,
                content: args.content,
                imageUrl: args.imageUrl,
                status: 'scheduled',
                scheduledFor: args.scheduledFor
            });
            const savedMessage = await message.save();
            return { ...savedMessage.toObject(), success: true };
        },
        deleteMessage: async (args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            await message_1.MessageModel.findByIdAndDelete(args.id);
            return { success: true, message: 'Message deleted' };
        }
    }
};
