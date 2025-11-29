import { MessageModel } from '../../schema/message';
import { UserModel } from '../../schema/user';
import { sendMessageToMember } from '../../utils/email';
import { v4 as uuidv4 } from 'uuid';

export const messageResolvers = {
    Query: {
        getMessages: async (args: any, context: any) => {
            if (!context.user) throw new Error('Authentication required');

            return await MessageModel.find({
                $or: [
                    { recipientId: context.userId, sendToAll: false },
                    { sendToAll: true }
                ]
            })
                .populate('senderId')
                .sort({ sentDate: -1 });
        },
        getMessageById: async (args: any, context: any) => {
            return await MessageModel.findByIdAndUpdate(
                args.id,
                { $addToSet: { readBy: context.userId } },
                { new: true }
            ).populate('senderId');
        }
    },
    Mutation: {
        sendMessage: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            try {
                const messageId = uuidv4();
                const message = new MessageModel({
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
                    const members = await UserModel.find({ role: 'member' });
                    for (const member of members) {
                        await sendMessageToMember({
                            email: member.email,
                            name: member.name,
                            messageTitle: args.title,
                            messageContent: args.content,
                            imageUrl: args.imageUrl
                        });
                    }
                } else {
                    const recipient = await UserModel.findById(args.recipientId);
                    if (recipient) {
                        await sendMessageToMember({
                            email: recipient.email,
                            name: recipient.name,
                            messageTitle: args.title,
                            messageContent: args.content,
                            imageUrl: args.imageUrl
                        });
                    }
                }

                return { ...savedMessage.toObject(), success: true };
            } catch (error: any) {
                throw new Error(`Failed to send message: ${error.message}`);
            }
        },

        scheduleMessage: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            const messageId = uuidv4();
            const message = new MessageModel({
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

        deleteMessage: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            await MessageModel.findByIdAndDelete(args.id);
            return { success: true, message: 'Message deleted' };
        }
    }
};
