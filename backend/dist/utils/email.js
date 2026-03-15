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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCampaignUpdateEmail = exports.sendEnquiryResponseEmail = exports.sendMessageToMember = exports.sendEventRegistrationEmail = exports.sendCertificateEmail = exports.sendBirthdayWish = exports.sendMembershipReceipt = exports.sendDonationReceipt = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
exports.sendDonationReceipt = function (donationData) { return __awaiter(void 0, void 0, void 0, function () {
    var donatorEmail, donator, amount, transactionId, donation_type, timestamp, receiptUrl, receiptHTML, mailOptions, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                donatorEmail = donationData.donatorEmail, donator = donationData.donator, amount = donationData.amount, transactionId = donationData.transactionId, donation_type = donationData.donation_type, timestamp = donationData.timestamp, receiptUrl = donationData.receiptUrl;
                receiptHTML = "\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <style>\n                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }\n                .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }\n                .content { background: #f9f9f9; padding: 30px; margin: 20px 0; border-radius: 5px; }\n                .receipt-details { background: white; padding: 20px; border-radius: 5px; }\n                .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }\n                .detail-label { font-weight: bold; }\n                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }\n                .amount { font-size: 24px; color: #4CAF50; font-weight: bold; }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div class=\"header\">\n                    <h1>\uD83D\uDE4F Thank You for Your Donation!</h1>\n                </div>\n                <div class=\"content\">\n                    <p>Dear " + donator + ",</p>\n                    <p>Thank you for your generous donation! Your contribution will make a significant impact on our mission.</p>\n                    \n                    <div class=\"receipt-details\">\n                        <h2>Donation Receipt</h2>\n                        <div class=\"detail-row\">\n                            <span class=\"detail-label\">Transaction ID:</span>\n                            <span>" + transactionId + "</span>\n                        </div>\n                        <div class=\"detail-row\">\n                            <span class=\"detail-label\">Donor Name:</span>\n                            <span>" + donator + "</span>\n                        </div>\n                        <div class=\"detail-row\">\n                            <span class=\"detail-label\">Amount:</span>\n                            <span class=\"amount\">\u20B9" + amount.toLocaleString('en-IN') + "</span>\n                        </div>\n                        <div class=\"detail-row\">\n                            <span class=\"detail-label\">Donation Type:</span>\n                            <span>" + donation_type + "</span>\n                        </div>\n                        <div class=\"detail-row\">\n                            <span class=\"detail-label\">Date:</span>\n                            <span>" + new Date(timestamp).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) + "</span>\n                        </div>\n                    </div>\n                    \n                    <p style=\"margin-top: 20px;\"><strong>Note:</strong> This is a computer-generated receipt. Please save this for your records. You can also download the PDF version from your dashboard.</p>\n                </div>\n                <div class=\"footer\">\n                    <p>NGO Management System</p>\n                    <p>For any queries, please contact us.</p>\n                </div>\n            </div>\n        </body>\n        </html>\n    ";
                mailOptions = {
                    from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
                    to: donatorEmail,
                    subject: "Donation Receipt - " + transactionId,
                    html: receiptHTML
                };
                // Attach PDF if receiptUrl is available
                if (receiptUrl) {
                    mailOptions.attachments = [
                        {
                            filename: "donation_receipt_" + transactionId + ".pdf",
                            path: receiptUrl
                        }
                    ];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                _a.sent();
                console.log("\u2705 Donation receipt sent to " + donatorEmail);
                return [2 /*return*/, true];
            case 3:
                error_1 = _a.sent();
                console.error('❌ Error sending email:', error_1);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendMembershipReceipt = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var email, name, membershipId, membershipFee, receiptHTML, mailOptions, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = userData.email, name = userData.name, membershipId = userData.membershipId, membershipFee = userData.membershipFee;
                receiptHTML = "\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <style>\n                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }\n                .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n                .header { background: #2196F3; color: white; padding: 20px; text-align: center; }\n                .content { background: #f9f9f9; padding: 30px; margin: 20px 0; border-radius: 5px; }\n                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div class=\"header\">\n                    <h1>\uD83C\uDF89 Welcome to Our Organization!</h1>\n                </div>\n                <div class=\"content\">\n                    <p>Dear " + name + ",</p>\n                    <p>Congratulations! Your membership has been activated.</p>\n                    <p><strong>Membership ID:</strong> " + membershipId + "</p>\n                    <p><strong>Membership Fee:</strong> \u20B9" + membershipFee + "</p>\n                    <p>You can now access all member benefits through your dashboard.</p>\n                </div>\n                <div class=\"footer\">\n                    <p>NGO Management System</p>\n                </div>\n            </div>\n        </body>\n        </html>\n    ";
                mailOptions = {
                    from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
                    to: email,
                    subject: "Membership Activated - " + membershipId,
                    html: receiptHTML
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                _a.sent();
                console.log("\u2705 Membership receipt sent to " + email);
                return [2 /*return*/, true];
            case 3:
                error_2 = _a.sent();
                console.error('❌ Error sending email:', error_2);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendBirthdayWish = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var email, name, wishHTML, mailOptions, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = userData.email, name = userData.name;
                wishHTML = "\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <style>\n                body { font-family: Arial, sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px; }\n                .card { background: white; max-width: 500px; margin: 0 auto; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }\n                h1 { color: #667eea; font-size: 36px; margin-bottom: 20px; }\n                p { font-size: 18px; color: #333; line-height: 1.6; }\n                .cake { font-size: 60px; margin: 20px 0; }\n            </style>\n        </head>\n        <body>\n            <div class=\"card\">\n                <div class=\"cake\">\uD83C\uDF82</div>\n                <h1>Happy Birthday, " + name + "!</h1>\n                <p>Wishing you a wonderful day filled with happiness and joy! \uD83C\uDF89</p>\n                <p>Thank you for being a valued member of our organization.</p>\n                <p>May this year bring you success and prosperity!</p>\n            </div>\n        </body>\n        </html>\n    ";
                mailOptions = {
                    from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
                    to: email,
                    subject: "\uD83C\uDF82 Happy Birthday " + name + "!",
                    html: wishHTML
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                _a.sent();
                console.log("\u2705 Birthday wish sent to " + email);
                return [2 /*return*/, true];
            case 3:
                error_3 = _a.sent();
                console.error('❌ Error sending birthday wish:', error_3);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendCertificateEmail = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var email, name, certificateTitle, certificateFile, verificationCode, certificateHTML, mailOptions, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = userData.email, name = userData.name, certificateTitle = userData.certificateTitle, certificateFile = userData.certificateFile, verificationCode = userData.verificationCode;
                certificateHTML = "\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <style>\n                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }\n                .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }\n                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }\n                .certificate-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; }\n                .code { font-family: monospace; background: #e0e0e0; padding: 10px; border-radius: 5px; }\n                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div class=\"header\">\n                    <h1>\uD83C\uDF96\uFE0F Certificate Awarded!</h1>\n                </div>\n                <div class=\"content\">\n                    <p>Dear " + name + ",</p>\n                    <p>Congratulations! You have been awarded a certificate for your excellence and dedication.</p>\n                    \n                    <div class=\"certificate-box\">\n                        <h2>" + certificateTitle + "</h2>\n                        <p>This certificate recognizes your outstanding contribution and commitment.</p>\n                    </div>\n                    \n                    <p><strong>Verification Code:</strong></p>\n                    <div class=\"code\">" + verificationCode + "</div>\n                    \n                    <p>Please find the PDF certificate attached to this email. You can verify the authenticity using the verification code above on our portal.</p>\n                </div>\n                <div class=\"footer\">\n                    <p>NGO Management System</p>\n                </div>\n            </div>\n        </body>\n        </html>\n    ";
                mailOptions = {
                    from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
                    to: email,
                    subject: "Certificate: " + certificateTitle,
                    html: certificateHTML
                };
                if (certificateFile) {
                    mailOptions.attachments = [
                        {
                            filename: "certificate.pdf",
                            path: certificateFile
                        }
                    ];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                _a.sent();
                console.log("\u2705 Certificate email sent to " + email);
                return [2 /*return*/, true];
            case 3:
                error_4 = _a.sent();
                console.error('❌ Error sending certificate email:', error_4);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendEventRegistrationEmail = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var email, name, eventTitle, eventDate, eventLocation, receiptFile, eventHTML, mailOptions, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = userData.email, name = userData.name, eventTitle = userData.eventTitle, eventDate = userData.eventDate, eventLocation = userData.eventLocation, receiptFile = userData.receiptFile;
                eventHTML = "\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <style>\n                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }\n                .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px; }\n                .event-details { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px; }\n                .detail-row { padding: 10px 0; border-bottom: 1px solid #ddd; }\n                .detail-label { font-weight: bold; }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div class=\"header\">\n                    <h1>\u2705 Event Registration Confirmed!</h1>\n                </div>\n                <div class=\"event-details\">\n                    <p>Dear " + name + ",</p>\n                    <p>Thank you for registering for our event. Your registration has been confirmed.</p>\n                    \n                    <div class=\"detail-row\">\n                        <span class=\"detail-label\">Event:</span> " + eventTitle + "\n                    </div>\n                    <div class=\"detail-row\">\n                        <span class=\"detail-label\">Date & Time:</span> " + eventDate + "\n                    </div>\n                    <div class=\"detail-row\">\n                        <span class=\"detail-label\">Location:</span> " + eventLocation + "\n                    </div>\n                    \n                    <p style=\"margin-top: 20px;\">Please arrive 15 minutes before the event starts. Bring this confirmation email or the attached receipt.</p>\n                </div>\n            </div>\n        </body>\n        </html>\n    ";
                mailOptions = {
                    from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
                    to: email,
                    subject: "Event Registration: " + eventTitle,
                    html: eventHTML
                };
                if (receiptFile) {
                    mailOptions.attachments = [
                        {
                            filename: "event_receipt.pdf",
                            path: receiptFile
                        }
                    ];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                _a.sent();
                console.log("\u2705 Event registration email sent to " + email);
                return [2 /*return*/, true];
            case 3:
                error_5 = _a.sent();
                console.error('❌ Error sending event registration email:', error_5);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendMessageToMember = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var email, name, messageTitle, messageContent, imageUrl, messageHTML, mailOptions, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = userData.email, name = userData.name, messageTitle = userData.messageTitle, messageContent = userData.messageContent, imageUrl = userData.imageUrl;
                messageHTML = "\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <style>\n                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }\n                .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n                .header { background: #2196F3; color: white; padding: 20px; text-align: center; }\n                .content { background: white; padding: 30px; }\n                .message-image { max-width: 100%; height: auto; margin: 20px 0; border-radius: 5px; }\n                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div class=\"header\">\n                    <h1>" + messageTitle + "</h1>\n                </div>\n                <div class=\"content\">\n                    <p>Dear " + name + ",</p>\n                    " + (imageUrl ? "<img src=\"" + imageUrl + "\" alt=\"message image\" class=\"message-image\">" : '') + "\n                    <p>" + messageContent + "</p>\n                </div>\n                <div class=\"footer\">\n                    <p>NGO Management System</p>\n                </div>\n            </div>\n        </body>\n        </html>\n    ";
                mailOptions = {
                    from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
                    to: email,
                    subject: messageTitle,
                    html: messageHTML
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                _a.sent();
                console.log("\u2705 Message sent to " + email);
                return [2 /*return*/, true];
            case 3:
                error_6 = _a.sent();
                console.error('❌ Error sending message:', error_6);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendEnquiryResponseEmail = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var email, name, response, responseHTML, mailOptions, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = userData.email, name = userData.name, response = userData.response;
                responseHTML = "\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <style>\n                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }\n                .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n                .header { background: #27AE60; color: white; padding: 20px; text-align: center; }\n                .response-box { background: #f0f8f0; padding: 20px; margin: 20px 0; border-left: 4px solid #27AE60; }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div class=\"header\">\n                    <h1>\u2705 Your Enquiry Has Been Addressed</h1>\n                </div>\n                <div class=\"response-box\">\n                    <p>Dear " + name + ",</p>\n                    <p>Thank you for your enquiry. Here is our response:</p>\n                    <p>" + response + "</p>\n                    <p>If you have any further questions, please feel free to contact us.</p>\n                </div>\n            </div>\n        </body>\n        </html>\n    ";
                mailOptions = {
                    from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
                    to: email,
                    subject: 'Response to Your Enquiry',
                    html: responseHTML
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                _a.sent();
                console.log("\u2705 Enquiry response sent to " + email);
                return [2 /*return*/, true];
            case 3:
                error_7 = _a.sent();
                console.error('❌ Error sending enquiry response:', error_7);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendCampaignUpdateEmail = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var email, name, campaignTitle, progress, totalRaised, goal, campaignHTML, mailOptions, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = userData.email, name = userData.name, campaignTitle = userData.campaignTitle, progress = userData.progress, totalRaised = userData.totalRaised, goal = userData.goal;
                campaignHTML = "\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <style>\n                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }\n                .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }\n                .progress-bar { width: 100%; height: 30px; background: #e0e0e0; border-radius: 15px; overflow: hidden; margin: 20px 0; }\n                .progress-fill { height: 100%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); width: " + progress + "%; text-align: center; color: white; line-height: 30px; font-weight: bold; }\n                .stats { background: #f5f5f5; padding: 20px; border-radius: 5px; }\n                .stat-item { padding: 10px 0; }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div class=\"header\">\n                    <h1>\uD83D\uDCCA Campaign Update: " + campaignTitle + "</h1>\n                </div>\n                <div class=\"stats\">\n                    <p>Dear " + name + ",</p>\n                    <p>We're excited to share an update on our campaign progress:</p>\n                    \n                    <div class=\"progress-bar\">\n                        <div class=\"progress-fill\">" + progress + "%</div>\n                    </div>\n                    \n                    <div class=\"stat-item\"><strong>Amount Raised:</strong> \u20B9" + totalRaised.toLocaleString('en-IN') + "</div>\n                    <div class=\"stat-item\"><strong>Goal:</strong> \u20B9" + goal.toLocaleString('en-IN') + "</div>\n                    <div class=\"stat-item\"><strong>Remaining:</strong> \u20B9" + (goal - totalRaised).toLocaleString('en-IN') + "</div>\n                </div>\n            </div>\n        </body>\n        </html>\n    ";
                mailOptions = {
                    from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
                    to: email,
                    subject: "Campaign Update: " + campaignTitle,
                    html: campaignHTML
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                _a.sent();
                console.log("\u2705 Campaign update sent to " + email);
                return [2 /*return*/, true];
            case 3:
                error_8 = _a.sent();
                console.error('❌ Error sending campaign update:', error_8);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
