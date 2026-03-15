"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.membershipResolvers = void 0;
var membership_1 = require("../../schema/membership");
var user_1 = require("../../schema/user");
var qrcode_1 = require("../../utils/qrcode");
var pdfGenerator_1 = require("../../utils/pdfGenerator");
var email_1 = require("../../utils/email");
exports.membershipResolvers = {
    Query: {
        getMemberships: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        return [4 /*yield*/, membership_1.MembershipModel.find()
                                .populate('userId')
                                .populate('designationId')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        getMembershipById: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var membership;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, membership_1.MembershipModel.findById(args.id)
                            .populate('userId')
                            .populate('designationId')];
                    case 1:
                        membership = _a.sent();
                        return [2 /*return*/, membership];
                }
            });
        }); },
        getMembershipsByStatus: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, membership_1.MembershipModel.find({ membershipStatus: args.status })
                            .populate('userId')
                            .populate('designationId')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }
    },
    Mutation: {
        registerMembership: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var userId, designationId, membershipFee, user, memberId, qrData, qrCode, idCardPath, membership, savedMembership, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        userId = args.userId, designationId = args.designationId, membershipFee = args.membershipFee;
                        return [4 /*yield*/, user_1.UserModel.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error('User not found');
                        memberId = "MEM-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
                        qrData = memberId + "|" + user.email + "|" + new Date().toISOString();
                        return [4 /*yield*/, qrcode_1.generateQRCodeDataURL(qrData)];
                    case 2:
                        qrCode = _a.sent();
                        return [4 /*yield*/, pdfGenerator_1.generateMembershipIDCard({
                                memberId: memberId,
                                name: user.name,
                                email: user.email,
                                designation: args.designationName || 'Member',
                                joinDate: new Date().toLocaleDateString()
                            }, qrData)];
                    case 3:
                        idCardPath = _a.sent();
                        membership = new membership_1.MembershipModel({
                            memberId: memberId,
                            userId: userId,
                            designationId: designationId,
                            membershipStatus: 'active',
                            membershipFee: membershipFee,
                            joiningDate: new Date(),
                            qrCode: qrCode,
                            idCardUrl: idCardPath
                        });
                        return [4 /*yield*/, membership.save()];
                    case 4:
                        savedMembership = _a.sent();
                        // Update user membership data
                        user.membershipId = memberId;
                        user.membershipStatus = 'active';
                        user.membershipFee = membershipFee;
                        user.membershipPaidDate = new Date();
                        return [4 /*yield*/, user.save()];
                    case 5:
                        _a.sent();
                        // Send receipt email
                        return [4 /*yield*/, email_1.sendMembershipReceipt({
                                email: user.email,
                                name: user.name,
                                membershipId: memberId,
                                membershipFee: membershipFee
                            })];
                    case 6:
                        // Send receipt email
                        _a.sent();
                        return [2 /*return*/, __assign(__assign({}, savedMembership.toObject()), { success: true, message: 'Membership registered successfully' })];
                    case 7:
                        error_1 = _a.sent();
                        throw new Error("Membership registration failed: " + error_1.message);
                    case 8: return [2 /*return*/];
                }
            });
        }); },
        renewMembership: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var membershipId, membership, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        membershipId = args.membershipId;
                        return [4 /*yield*/, membership_1.MembershipModel.findByIdAndUpdate(membershipId, {
                                membershipStatus: 'active',
                                renewalDate: new Date(),
                                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                            }, { new: true }).populate('userId')];
                    case 1:
                        membership = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, membership === null || membership === void 0 ? void 0 : membership.toObject()), { success: true, message: 'Membership renewed successfully' })];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error("Membership renewal failed: " + error_2.message);
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        suspendMembership: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var membership;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        return [4 /*yield*/, membership_1.MembershipModel.findByIdAndUpdate(args.membershipId, { membershipStatus: 'suspended' }, { new: true })];
                    case 1:
                        membership = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, membership === null || membership === void 0 ? void 0 : membership.toObject()), { success: true, message: 'Membership suspended' })];
                }
            });
        }); }
    }
};
