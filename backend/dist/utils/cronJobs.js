"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCronJobs = exports.sendScheduledMessages = exports.checkMembershipRenewal = exports.checkCampaignDeadlines = exports.sendBirthdayWishes = exports.pollPaymentStatus = void 0;
// Payment status polling helper
const pollPaymentStatus = async (transactionId, maxAttempts = 10, delayMs = 2000) => {
    let attempts = 0;
    return new Promise((resolve) => {
        const poll = async () => {
            attempts++;
            // Check payment status
            const isComplete = await checkPaymentCompletion(transactionId);
            if (isComplete) {
                resolve(true);
            }
            else if (attempts < maxAttempts) {
                setTimeout(poll, delayMs);
            }
            else {
                resolve(false);
            }
        };
        poll();
    });
};
exports.pollPaymentStatus = pollPaymentStatus;
const checkPaymentCompletion = async (transactionId) => {
    // Implementation would check with payment gateways
    return false;
};
// Cron job to send birthday wishes
const sendBirthdayWishes = async () => {
    try {
        const UserModel = require('../schema/user').UserModel;
        const sendBirthdayWish = require('./email').sendBirthdayWish;
        const today = new Date();
        const users = await UserModel.find({
            $expr: {
                $and: [
                    { $eq: [{ $month: '$dateOfBirth' }, today.getMonth() + 1] },
                    { $eq: [{ $dayOfMonth: '$dateOfBirth' }, today.getDate()] }
                ]
            }
        });
        for (const user of users) {
            await sendBirthdayWish({
                email: user.email,
                name: user.name
            });
        }
        console.log(`✅ Birthday wishes sent to ${users.length} members`);
    }
    catch (error) {
        console.error('❌ Error sending birthday wishes:', error);
    }
};
exports.sendBirthdayWishes = sendBirthdayWishes;
// Cron job to check campaign deadlines
const checkCampaignDeadlines = async () => {
    try {
        const CampaignModel = require('../schema/campaign').CampaignModel;
        const expiredCampaigns = await CampaignModel.find({
            endDate: { $lt: new Date() },
            status: 'active'
        });
        for (const campaign of expiredCampaigns) {
            campaign.status = 'completed';
            await campaign.save();
        }
        console.log(`✅ ${expiredCampaigns.length} campaigns marked as completed`);
    }
    catch (error) {
        console.error('❌ Error checking campaign deadlines:', error);
    }
};
exports.checkCampaignDeadlines = checkCampaignDeadlines;
// Cron job to check membership renewal dates
const checkMembershipRenewal = async () => {
    try {
        const MembershipModel = require('../schema/membership').MembershipModel;
        const sendBirthdayWish = require('./email').sendMembershipReceipt;
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        const expiringSoon = await MembershipModel.find({
            expiryDate: {
                $gte: today,
                $lt: thirtyDaysFromNow
            },
            membershipStatus: 'active'
        }).populate('userId');
        for (const membership of expiringSoon) {
            // Send renewal reminder
            await sendBirthdayWish({
                email: membership.userId.email,
                name: membership.userId.name,
                membershipId: membership.memberId,
                membershipFee: membership.membershipFee
            });
        }
        console.log(`✅ Renewal reminders sent to ${expiringSoon.length} members`);
    }
    catch (error) {
        console.error('❌ Error checking membership renewal:', error);
    }
};
exports.checkMembershipRenewal = checkMembershipRenewal;
// Scheduled message sender
const sendScheduledMessages = async () => {
    try {
        const MessageModel = require('../schema/message').MessageModel;
        const UserModel = require('../schema/user').UserModel;
        const sendMessageToMember = require('./email').sendMessageToMember;
        const now = new Date();
        const scheduledMessages = await MessageModel.find({
            status: 'scheduled',
            scheduledFor: { $lt: now }
        }).populate('senderId');
        for (const message of scheduledMessages) {
            if (message.sendToAll) {
                const members = await UserModel.find({ role: 'member' });
                for (const member of members) {
                    await sendMessageToMember({
                        email: member.email,
                        name: member.name,
                        messageTitle: message.title,
                        messageContent: message.content,
                        imageUrl: message.imageUrl
                    });
                }
            }
            else {
                const recipient = await UserModel.findById(message.recipientId);
                if (recipient) {
                    await sendMessageToMember({
                        email: recipient.email,
                        name: recipient.name,
                        messageTitle: message.title,
                        messageContent: message.content,
                        imageUrl: message.imageUrl
                    });
                }
            }
            message.status = 'sent';
            await message.save();
        }
        console.log(`✅ ${scheduledMessages.length} scheduled messages sent`);
    }
    catch (error) {
        console.error('❌ Error sending scheduled messages:', error);
    }
};
exports.sendScheduledMessages = sendScheduledMessages;
// Initialize cron jobs
const initializeCronJobs = () => {
    // Send birthday wishes daily at 8 AM
    scheduleJob('0 8 * * *', exports.sendBirthdayWishes);
    // Check campaign deadlines every hour
    scheduleJob('0 * * * *', exports.checkCampaignDeadlines);
    // Check membership renewal daily at 9 AM
    scheduleJob('0 9 * * *', exports.checkMembershipRenewal);
    // Check scheduled messages every 5 minutes
    scheduleJob('*/5 * * * *', exports.sendScheduledMessages);
    console.log('✅ Cron jobs initialized');
};
exports.initializeCronJobs = initializeCronJobs;
// Simple scheduler (can be replaced with node-cron)
const scheduleJob = (cronExpression, job) => {
    // Simplified version - use node-cron in production
    setInterval(job, 60000); // Run every minute as placeholder
};
