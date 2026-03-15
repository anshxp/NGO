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
exports.enquiryResolvers = void 0;
var enquiry_1 = require("../../schema/enquiry");
var email_1 = require("../../utils/email");
exports.enquiryResolvers = {
    Query: {
        getEnquiries: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        return [4 /*yield*/, enquiry_1.EnquiryModel.find()
                                .sort({ created_at: -1 })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        getEnquiryById: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        return [4 /*yield*/, enquiry_1.EnquiryModel.findById(args.id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        getNewEnquiries: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        return [4 /*yield*/, enquiry_1.EnquiryModel.find({ status: 'new' })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }
    },
    Mutation: {
        submitEnquiry: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var name_1, email, phone, subject, message, enquiry, savedEnquiry, autoResponseHTML, nodemailer, transporter, emailError_1, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🔵 ===== submitEnquiry CALLED =====');
                        console.log('📝 Arguments received:', JSON.stringify(args, null, 2));
                        console.log('👤 Context user:', context.user ? context.user.name + " (" + context.user.role + ")" : 'No user');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        name_1 = args.name, email = args.email, phone = args.phone, subject = args.subject, message = args.message;
                        console.log('📦 Destructured values:', { name: name_1, email: email, phone: phone, subject: subject, message: message });
                        enquiry = new enquiry_1.EnquiryModel({
                            name: name_1,
                            email: email,
                            phone: phone,
                            subject: subject,
                            message: message,
                            status: 'new'
                        });
                        console.log('💾 Saving enquiry to database...');
                        return [4 /*yield*/, enquiry.save()];
                    case 2:
                        savedEnquiry = _a.sent();
                        console.log('✅ Enquiry saved successfully:', savedEnquiry._id);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        console.log('📧 Attempting to send auto-response email to:', email);
                        autoResponseHTML = "\n                        <!DOCTYPE html>\n                        <html>\n                        <head>\n                            <style>\n                                body { font-family: Arial, sans-serif; }\n                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n                                .header { background: #2196F3; color: white; padding: 20px; text-align: center; }\n                                .content { background: #f5f5f5; padding: 20px; }\n                            </style>\n                        </head>\n                        <body>\n                            <div class=\"container\">\n                                <div class=\"header\">\n                                    <h1>Thank You for Your Enquiry</h1>\n                                </div>\n                                <div class=\"content\">\n                                    <p>Dear " + name_1 + ",</p>\n                                    <p>Thank you for reaching out to us. We have received your enquiry and will respond shortly.</p>\n                                    <p><strong>Enquiry Subject:</strong> " + subject + "</p>\n                                    <p>Our team will review your message and get back to you soon.</p>\n                                </div>\n                            </div>\n                        </body>\n                        </html>\n                    ";
                        nodemailer = require('nodemailer');
                        transporter = nodemailer.createTransport({
                            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                            port: parseInt(process.env.EMAIL_PORT || '587'),
                            secure: false,
                            auth: {
                                user: process.env.EMAIL_USER,
                                pass: process.env.EMAIL_PASSWORD
                            }
                        });
                        console.log('🔗 Email config - Host:', process.env.EMAIL_HOST, 'User:', process.env.EMAIL_USER);
                        return [4 /*yield*/, transporter.sendMail({
                                from: process.env.EMAIL_FROM || 'NGO Management <noreply@ngo.org>',
                                to: email,
                                subject: "Enquiry Confirmation - " + subject,
                                html: autoResponseHTML
                            })];
                    case 4:
                        _a.sent();
                        console.log('✅ Email sent successfully');
                        return [3 /*break*/, 6];
                    case 5:
                        emailError_1 = _a.sent();
                        console.error('⚠️ Email sending error:', emailError_1.message);
                        return [3 /*break*/, 6];
                    case 6:
                        response = { success: true, message: 'Enquiry submitted successfully' };
                        console.log('✅ Returning response:', response);
                        console.log('🔵 ===== submitEnquiry SUCCESS =====\n');
                        return [2 /*return*/, response];
                    case 7:
                        error_1 = _a.sent();
                        console.error('\n❌ ===== submitEnquiry ERROR =====');
                        console.error('💬 Error message:', error_1.message);
                        console.error('📍 Error stack:', error_1.stack);
                        console.error('❌ ===== END ERROR =====\n');
                        throw new Error("Failed to submit enquiry: " + error_1.message);
                    case 8: return [2 /*return*/];
                }
            });
        }); },
        markEnquiryAsRead: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var enquiry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        return [4 /*yield*/, enquiry_1.EnquiryModel.findByIdAndUpdate(args.id, { status: 'read' }, { new: true })];
                    case 1:
                        enquiry = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, enquiry === null || enquiry === void 0 ? void 0 : enquiry.toObject()), { success: true })];
                }
            });
        }); },
        replyToEnquiry: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var enquiry, savedEnquiry, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, enquiry_1.EnquiryModel.findById(args.id)];
                    case 2:
                        enquiry = _a.sent();
                        if (!enquiry)
                            throw new Error('Enquiry not found');
                        enquiry.reply = args.reply;
                        enquiry.repliedBy = context.userId;
                        enquiry.repliedAt = new Date();
                        enquiry.status = 'replied';
                        return [4 /*yield*/, enquiry.save()];
                    case 3:
                        savedEnquiry = _a.sent();
                        // Send reply email
                        return [4 /*yield*/, email_1.sendEnquiryResponseEmail({
                                email: enquiry.email,
                                name: enquiry.name,
                                response: args.reply
                            })];
                    case 4:
                        // Send reply email
                        _a.sent();
                        return [2 /*return*/, __assign(__assign({}, savedEnquiry.toObject()), { success: true, message: 'Reply sent successfully' })];
                    case 5:
                        error_2 = _a.sent();
                        throw new Error("Failed to reply: " + error_2.message);
                    case 6: return [2 /*return*/];
                }
            });
        }); },
        deleteEnquiry: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        return [4 /*yield*/, enquiry_1.EnquiryModel.findByIdAndDelete(args.id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: 'Enquiry deleted' }];
                }
            });
        }); }
    }
};
