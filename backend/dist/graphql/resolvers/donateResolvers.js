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
exports.donateResolvers = void 0;
var donate_1 = require("../../schema/donate");
var user_1 = require("../../schema/user");
var email_1 = require("../../utils/email");
var razorpay_1 = __importDefault(require("razorpay"));
var crypto_1 = __importDefault(require("crypto"));
var pdf_1 = require("../../utils/pdf");
var razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || 'test_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret'
});
exports.donateResolvers = {
    Query: {
        getDonations: function (_a) {
            var _b = _a.limit, limit = _b === void 0 ? 10 : _b, _c = _a.offset, offset = _c === void 0 ? 0 : _c;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, donate_1.DonateModel.find().limit(limit).skip(offset).populate('referredBy')];
                        case 1: return [2 /*return*/, _d.sent()];
                    }
                });
            });
        },
        getDonation: function (_a) {
            var id = _a.id;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, donate_1.DonateModel.findById(id).populate('referredBy')];
                        case 1: return [2 /*return*/, _b.sent()];
                    }
                });
            });
        },
        getDonationsByStatus: function (_a) {
            var status = _a.status;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, donate_1.DonateModel.find({ payment_status: status }).populate('referredBy')];
                        case 1: return [2 /*return*/, _b.sent()];
                    }
                });
            });
        },
        getDonationStats: function () { return __awaiter(void 0, void 0, void 0, function () {
            var allDonations, successfulDonations, failedDonations, pendingDonations, totalAmount, pendingAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, donate_1.DonateModel.find()];
                    case 1:
                        allDonations = _a.sent();
                        successfulDonations = allDonations.filter(function (d) { return d.payment_status === 'SUCCESS'; });
                        failedDonations = allDonations.filter(function (d) { return d.payment_status === 'FAILED'; });
                        pendingDonations = allDonations.filter(function (d) { return d.payment_status === 'PENDING'; });
                        totalAmount = successfulDonations.reduce(function (sum, d) { return sum + d.amount; }, 0);
                        pendingAmount = pendingDonations.reduce(function (sum, d) { return sum + d.amount; }, 0);
                        return [2 /*return*/, {
                                totalDonations: allDonations.length,
                                totalAmount: totalAmount,
                                pendingAmount: pendingAmount,
                                successfulDonations: successfulDonations.length,
                                failedDonations: failedDonations.length
                            }];
                }
            });
        }); },
        getUserDonations: function (_a) {
            var userId = _a.userId;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, donate_1.DonateModel.find({ referredBy: userId })];
                        case 1: return [2 /*return*/, _b.sent()];
                    }
                });
            });
        }
    },
    Mutation: {
        createDonation: function (_a, context) {
            var input = _a.input;
            return __awaiter(void 0, void 0, void 0, function () {
                var donator, donatorEmail, contact, address, amount, payment_method, donation_type, isAnonymous, referralCode, referrer, transactionId, donation, emailError_1, emailError_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            donator = input.donator, donatorEmail = input.donatorEmail, contact = input.contact, address = input.address, amount = input.amount, payment_method = input.payment_method, donation_type = input.donation_type, isAnonymous = input.isAnonymous, referralCode = input.referralCode;
                            referrer = null;
                            if (!referralCode) return [3 /*break*/, 2];
                            return [4 /*yield*/, user_1.UserModel.findOne({ referralCode: referralCode })];
                        case 1:
                            referrer = _b.sent();
                            _b.label = 2;
                        case 2:
                            transactionId = "TXN" + Date.now() + Math.random().toString(36).substring(2, 9).toUpperCase();
                            donation = new donate_1.DonateModel({
                                donator: donator,
                                donatorEmail: donatorEmail,
                                contact: contact,
                                address: address,
                                transactionId: transactionId,
                                amount: amount,
                                payment_method: payment_method,
                                donation_type: donation_type,
                                isAnonymous: isAnonymous || false,
                                referredBy: referrer === null || referrer === void 0 ? void 0 : referrer._id,
                                payment_status: 'PENDING'
                            });
                            return [4 /*yield*/, donation.save()];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, email_1.sendDonationReceipt(donation)];
                        case 5:
                            _b.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            emailError_1 = _b.sent();
                            console.error('Failed to send donation receipt:', emailError_1);
                            return [3 /*break*/, 7];
                        case 7:
                            if (!referrer) return [3 /*break*/, 9];
                            referrer.totalDonationsReferred += amount;
                            return [4 /*yield*/, referrer.save()];
                        case 8:
                            _b.sent();
                            _b.label = 9;
                        case 9:
                            _b.trys.push([9, 11, , 12]);
                            return [4 /*yield*/, email_1.sendDonationReceipt(donation)];
                        case 10:
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 11:
                            emailError_2 = _b.sent();
                            console.error('Failed to send cash donation receipt:', emailError_2);
                            return [3 /*break*/, 12];
                        case 12: return [2 /*return*/, donation];
                    }
                });
            });
        },
        createDonationOrder: function (_a) {
            var input = _a.input;
            return __awaiter(void 0, void 0, void 0, function () {
                var donator, donatorEmail, contact, address, amount, payment_method, donation_type, isAnonymous, referralCode, referrer, order, transactionId, donation;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            donator = input.donator, donatorEmail = input.donatorEmail, contact = input.contact, address = input.address, amount = input.amount, payment_method = input.payment_method, donation_type = input.donation_type, isAnonymous = input.isAnonymous, referralCode = input.referralCode;
                            if (payment_method !== 'razorpay') {
                                throw new Error('payment_method must be razorpay for order creation');
                            }
                            referrer = null;
                            if (!referralCode) return [3 /*break*/, 2];
                            return [4 /*yield*/, user_1.UserModel.findOne({ referralCode: referralCode })];
                        case 1:
                            referrer = _b.sent();
                            _b.label = 2;
                        case 2: return [4 /*yield*/, razorpay.orders.create({
                                amount: Math.round(amount * 100),
                                currency: 'INR',
                                receipt: "rcpt_" + Date.now(),
                                notes: {
                                    donator: donator,
                                    donation_type: donation_type
                                }
                            })];
                        case 3:
                            order = _b.sent();
                            transactionId = "ORD" + Date.now() + Math.random().toString(36).substring(2, 7).toUpperCase();
                            donation = new donate_1.DonateModel({
                                donator: donator,
                                donatorEmail: donatorEmail,
                                contact: contact,
                                address: address,
                                transactionId: transactionId,
                                amount: amount,
                                payment_method: payment_method,
                                donation_type: donation_type,
                                isAnonymous: isAnonymous || false,
                                referredBy: referrer === null || referrer === void 0 ? void 0 : referrer._id,
                                payment_status: 'PENDING',
                                orderId: order.id
                            });
                            return [4 /*yield*/, donation.save()];
                        case 4:
                            _b.sent();
                            return [2 /*return*/, donation];
                    }
                });
            });
        },
        verifyDonationPayment: function (_a) {
            var orderId = _a.orderId, paymentId = _a.paymentId, signature = _a.signature;
            return __awaiter(void 0, void 0, void 0, function () {
                var donation, expected, pdfPath, pdfErr_1, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, donate_1.DonateModel.findOne({ orderId: orderId })];
                        case 1:
                            donation = _b.sent();
                            if (!donation)
                                throw new Error('Donation order not found');
                            expected = crypto_1.default.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
                                .update(orderId + '|' + paymentId)
                                .digest('hex');
                            if (!(expected !== signature)) return [3 /*break*/, 3];
                            donation.payment_status = 'FAILED';
                            return [4 /*yield*/, donation.save()];
                        case 2:
                            _b.sent();
                            throw new Error('Invalid payment signature');
                        case 3:
                            donation.payment_status = 'SUCCESS';
                            donation.paymentId = paymentId;
                            donation.signature = signature;
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, pdf_1.generateDonationPDF(donation)];
                        case 5:
                            pdfPath = _b.sent();
                            donation.receiptUrl = pdfPath;
                            return [3 /*break*/, 7];
                        case 6:
                            pdfErr_1 = _b.sent();
                            console.error('PDF generation failed', pdfErr_1);
                            return [3 /*break*/, 7];
                        case 7: return [4 /*yield*/, donation.save()];
                        case 8:
                            _b.sent();
                            _b.label = 9;
                        case 9:
                            _b.trys.push([9, 11, , 12]);
                            return [4 /*yield*/, email_1.sendDonationReceipt(donation)];
                        case 10:
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 11:
                            e_1 = _b.sent();
                            console.error('Email send failed after verification', e_1);
                            return [3 /*break*/, 12];
                        case 12: return [2 /*return*/, donation];
                    }
                });
            });
        },
        updateDonationStatus: function (_a, context) {
            var id = _a.id, status = _a.status;
            return __awaiter(void 0, void 0, void 0, function () {
                var donation;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!context.userId || context.user.role !== 'admin') {
                                throw new Error('Unauthorized');
                            }
                            return [4 /*yield*/, donate_1.DonateModel.findById(id)];
                        case 1:
                            donation = _b.sent();
                            if (!donation) {
                                throw new Error('Donation not found');
                            }
                            donation.payment_status = status;
                            return [4 /*yield*/, donation.save()];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, donation];
                    }
                });
            });
        },
        createCashDonation: function (_a, context) {
            var input = _a.input;
            return __awaiter(void 0, void 0, void 0, function () {
                var donator, donatorEmail, contact, address, amount, donation_type, isAnonymous, referralCode, referrer, transactionId, donation;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!context.userId || context.user.role !== 'admin') {
                                throw new Error('Unauthorized - Admin only');
                            }
                            donator = input.donator, donatorEmail = input.donatorEmail, contact = input.contact, address = input.address, amount = input.amount, donation_type = input.donation_type, isAnonymous = input.isAnonymous, referralCode = input.referralCode;
                            referrer = null;
                            if (!referralCode) return [3 /*break*/, 2];
                            return [4 /*yield*/, user_1.UserModel.findOne({ referralCode: referralCode })];
                        case 1:
                            referrer = _b.sent();
                            _b.label = 2;
                        case 2:
                            transactionId = "CASH" + Date.now() + Math.random().toString(36).substring(2, 9).toUpperCase();
                            donation = new donate_1.DonateModel({
                                donator: donator,
                                donatorEmail: donatorEmail,
                                contact: contact,
                                address: address,
                                transactionId: transactionId,
                                amount: amount,
                                payment_method: 'cash',
                                donation_type: donation_type,
                                isAnonymous: isAnonymous || false,
                                referredBy: referrer === null || referrer === void 0 ? void 0 : referrer._id,
                                payment_status: 'SUCCESS'
                            });
                            return [4 /*yield*/, donation.save()];
                        case 3:
                            _b.sent();
                            if (!referrer) return [3 /*break*/, 5];
                            referrer.totalDonationsReferred += amount;
                            return [4 /*yield*/, referrer.save()];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [2 /*return*/, donation];
                    }
                });
            });
        }
    }
};
