"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCronJobs = exports.sendScheduledMessages = exports.checkMembershipRenewal = exports.checkCampaignDeadlines = exports.sendBirthdayWishes = exports.pollPaymentStatus = void 0;
// Payment status polling helper
exports.pollPaymentStatus = function (transactionId, maxAttempts, delayMs) {
    if (maxAttempts === void 0) { maxAttempts = 10; }
    if (delayMs === void 0) { delayMs = 2000; }
    return __awaiter(void 0, void 0, void 0, function () {
        var attempts;
        return __generator(this, function (_a) {
            attempts = 0;
            return [2 /*return*/, new Promise(function (resolve) {
                    var poll = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var isComplete;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    attempts++;
                                    return [4 /*yield*/, checkPaymentCompletion(transactionId)];
                                case 1:
                                    isComplete = _a.sent();
                                    if (isComplete) {
                                        resolve(true);
                                    }
                                    else if (attempts < maxAttempts) {
                                        setTimeout(poll, delayMs);
                                    }
                                    else {
                                        resolve(false);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    poll();
                })];
        });
    });
};
var checkPaymentCompletion = function (transactionId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Implementation would check with payment gateways
        return [2 /*return*/, false];
    });
}); };
// Cron job to send birthday wishes
exports.sendBirthdayWishes = function () { return __awaiter(void 0, void 0, void 0, function () {
    var UserModel, sendBirthdayWish, today, users, _i, users_1, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                UserModel = require('../schema/user').UserModel;
                sendBirthdayWish = require('./email').sendBirthdayWish;
                today = new Date();
                return [4 /*yield*/, UserModel.find({
                        $expr: {
                            $and: [
                                { $eq: [{ $month: '$dateOfBirth' }, today.getMonth() + 1] },
                                { $eq: [{ $dayOfMonth: '$dateOfBirth' }, today.getDate()] }
                            ]
                        }
                    })];
            case 1:
                users = _a.sent();
                _i = 0, users_1 = users;
                _a.label = 2;
            case 2:
                if (!(_i < users_1.length)) return [3 /*break*/, 5];
                user = users_1[_i];
                return [4 /*yield*/, sendBirthdayWish({
                        email: user.email,
                        name: user.name
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                console.log("\u2705 Birthday wishes sent to " + users.length + " members");
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error('❌ Error sending birthday wishes:', error_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// Cron job to check campaign deadlines
exports.checkCampaignDeadlines = function () { return __awaiter(void 0, void 0, void 0, function () {
    var CampaignModel, expiredCampaigns, _i, expiredCampaigns_1, campaign, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                CampaignModel = require('../schema/campaign').CampaignModel;
                return [4 /*yield*/, CampaignModel.find({
                        endDate: { $lt: new Date() },
                        status: 'active'
                    })];
            case 1:
                expiredCampaigns = _a.sent();
                _i = 0, expiredCampaigns_1 = expiredCampaigns;
                _a.label = 2;
            case 2:
                if (!(_i < expiredCampaigns_1.length)) return [3 /*break*/, 5];
                campaign = expiredCampaigns_1[_i];
                campaign.status = 'completed';
                return [4 /*yield*/, campaign.save()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                console.log("\u2705 " + expiredCampaigns.length + " campaigns marked as completed");
                return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                console.error('❌ Error checking campaign deadlines:', error_2);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// Cron job to check membership renewal dates
exports.checkMembershipRenewal = function () { return __awaiter(void 0, void 0, void 0, function () {
    var MembershipModel, sendBirthdayWish, today, thirtyDaysFromNow, expiringSoon, _i, expiringSoon_1, membership, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                MembershipModel = require('../schema/membership').MembershipModel;
                sendBirthdayWish = require('./email').sendMembershipReceipt;
                today = new Date();
                thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                return [4 /*yield*/, MembershipModel.find({
                        expiryDate: {
                            $gte: today,
                            $lt: thirtyDaysFromNow
                        },
                        membershipStatus: 'active'
                    }).populate('userId')];
            case 1:
                expiringSoon = _a.sent();
                _i = 0, expiringSoon_1 = expiringSoon;
                _a.label = 2;
            case 2:
                if (!(_i < expiringSoon_1.length)) return [3 /*break*/, 5];
                membership = expiringSoon_1[_i];
                // Send renewal reminder
                return [4 /*yield*/, sendBirthdayWish({
                        email: membership.userId.email,
                        name: membership.userId.name,
                        membershipId: membership.memberId,
                        membershipFee: membership.membershipFee
                    })];
            case 3:
                // Send renewal reminder
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                console.log("\u2705 Renewal reminders sent to " + expiringSoon.length + " members");
                return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                console.error('❌ Error checking membership renewal:', error_3);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// Scheduled message sender
exports.sendScheduledMessages = function () { return __awaiter(void 0, void 0, void 0, function () {
    var MessageModel, UserModel, sendMessageToMember, now, scheduledMessages, _i, scheduledMessages_1, message, members, _a, members_1, member, recipient, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 15, , 16]);
                MessageModel = require('../schema/message').MessageModel;
                UserModel = require('../schema/user').UserModel;
                sendMessageToMember = require('./email').sendMessageToMember;
                now = new Date();
                return [4 /*yield*/, MessageModel.find({
                        status: 'scheduled',
                        scheduledFor: { $lt: now }
                    }).populate('senderId')];
            case 1:
                scheduledMessages = _b.sent();
                _i = 0, scheduledMessages_1 = scheduledMessages;
                _b.label = 2;
            case 2:
                if (!(_i < scheduledMessages_1.length)) return [3 /*break*/, 14];
                message = scheduledMessages_1[_i];
                if (!message.sendToAll) return [3 /*break*/, 8];
                return [4 /*yield*/, UserModel.find({ role: 'member' })];
            case 3:
                members = _b.sent();
                _a = 0, members_1 = members;
                _b.label = 4;
            case 4:
                if (!(_a < members_1.length)) return [3 /*break*/, 7];
                member = members_1[_a];
                return [4 /*yield*/, sendMessageToMember({
                        email: member.email,
                        name: member.name,
                        messageTitle: message.title,
                        messageContent: message.content,
                        imageUrl: message.imageUrl
                    })];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                _a++;
                return [3 /*break*/, 4];
            case 7: return [3 /*break*/, 11];
            case 8: return [4 /*yield*/, UserModel.findById(message.recipientId)];
            case 9:
                recipient = _b.sent();
                if (!recipient) return [3 /*break*/, 11];
                return [4 /*yield*/, sendMessageToMember({
                        email: recipient.email,
                        name: recipient.name,
                        messageTitle: message.title,
                        messageContent: message.content,
                        imageUrl: message.imageUrl
                    })];
            case 10:
                _b.sent();
                _b.label = 11;
            case 11:
                message.status = 'sent';
                return [4 /*yield*/, message.save()];
            case 12:
                _b.sent();
                _b.label = 13;
            case 13:
                _i++;
                return [3 /*break*/, 2];
            case 14:
                console.log("\u2705 " + scheduledMessages.length + " scheduled messages sent");
                return [3 /*break*/, 16];
            case 15:
                error_4 = _b.sent();
                console.error('❌ Error sending scheduled messages:', error_4);
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/];
        }
    });
}); };
// Initialize cron jobs
exports.initializeCronJobs = function () {
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
// Simple scheduler (can be replaced with node-cron)
var scheduleJob = function (cronExpression, job) {
    // Simplified version - use node-cron in production
    setInterval(job, 60000); // Run every minute as placeholder
};
