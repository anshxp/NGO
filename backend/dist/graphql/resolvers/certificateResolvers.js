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
exports.certificateResolvers = void 0;
var certificate_1 = require("../../schema/certificate");
var visitorCertificate_1 = require("../../schema/visitorCertificate");
var qrcode_1 = require("../../utils/qrcode");
var pdfGenerator_1 = require("../../utils/pdfGenerator");
var email_1 = require("../../utils/email");
var uuid_1 = require("uuid");
exports.certificateResolvers = {
    Query: {
        getCertificates: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, certificate_1.CertificateModel.find({ recipientType: 'member' })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        getVisitorCertificates: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, visitorCertificate_1.VisitorCertificateModel.find()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        verifyCertificate: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var verificationCode, certificate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        verificationCode = args.verificationCode;
                        return [4 /*yield*/, certificate_1.CertificateModel.findOne({ verificationCode: verificationCode })];
                    case 1:
                        certificate = _a.sent();
                        if (!certificate)
                            throw new Error('Certificate not found');
                        return [2 /*return*/, __assign(__assign({}, certificate.toObject()), { isVerified: true })];
                }
            });
        }); },
        verifyVisitorCertificate: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var verificationCode, certificate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        verificationCode = args.verificationCode;
                        return [4 /*yield*/, visitorCertificate_1.VisitorCertificateModel.findOne({ verificationCode: verificationCode })];
                    case 1:
                        certificate = _a.sent();
                        if (!certificate)
                            throw new Error('Certificate not found');
                        return [2 /*return*/, __assign(__assign({}, certificate.toObject()), { isVerified: true })];
                }
            });
        }); }
    },
    Mutation: {
        issueCertificate: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var recipientId, title, description, recipientEmail, recipientName, verificationCode, certificateId, qrData, qrCode, pdfPath, certificate, savedCertificate, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        recipientId = args.recipientId, title = args.title, description = args.description, recipientEmail = args.recipientEmail, recipientName = args.recipientName;
                        verificationCode = uuid_1.v4();
                        certificateId = "CERT-" + Date.now();
                        qrData = certificateId + "|" + verificationCode + "|" + new Date().toISOString();
                        return [4 /*yield*/, qrcode_1.generateQRCodeDataURL(qrData)];
                    case 2:
                        qrCode = _a.sent();
                        return [4 /*yield*/, pdfGenerator_1.generateCertificate({
                                recipientName: recipientName,
                                title: title,
                                description: description,
                                issueDate: new Date().toLocaleDateString(),
                                verificationCode: verificationCode
                            }, qrData)];
                    case 3:
                        pdfPath = _a.sent();
                        certificate = new certificate_1.CertificateModel({
                            certificateId: certificateId,
                            recipientId: recipientId,
                            recipientType: 'member',
                            recipientName: recipientName,
                            recipientEmail: recipientEmail,
                            title: title,
                            description: description,
                            qrCode: qrCode,
                            pdfUrl: pdfPath,
                            verificationCode: verificationCode,
                            issueDate: new Date()
                        });
                        return [4 /*yield*/, certificate.save()];
                    case 4:
                        savedCertificate = _a.sent();
                        // Send email
                        return [4 /*yield*/, email_1.sendCertificateEmail({
                                email: recipientEmail,
                                name: recipientName,
                                certificateTitle: title,
                                certificateFile: pdfPath,
                                verificationCode: verificationCode
                            })];
                    case 5:
                        // Send email
                        _a.sent();
                        return [2 /*return*/, __assign(__assign({}, savedCertificate.toObject()), { success: true, message: 'Certificate issued successfully' })];
                    case 6:
                        error_1 = _a.sent();
                        throw new Error("Certificate issuance failed: " + error_1.message);
                    case 7: return [2 /*return*/];
                }
            });
        }); },
        issueVisitorCertificate: function (args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var visitorName, visitorEmail, visitorPhone, title, description, template, verificationCode, certificateId, qrData, qrCode, pdfPath, certificate, savedCertificate, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!context.user || context.user.role !== 'admin') {
                            throw new Error('Unauthorized');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        visitorName = args.visitorName, visitorEmail = args.visitorEmail, visitorPhone = args.visitorPhone, title = args.title, description = args.description, template = args.template;
                        verificationCode = uuid_1.v4();
                        certificateId = "VCERT-" + Date.now();
                        qrData = certificateId + "|" + verificationCode + "|" + new Date().toISOString();
                        return [4 /*yield*/, qrcode_1.generateQRCodeDataURL(qrData)];
                    case 2:
                        qrCode = _a.sent();
                        return [4 /*yield*/, pdfGenerator_1.generateCertificate({
                                recipientName: visitorName,
                                title: title,
                                description: description,
                                issueDate: new Date().toLocaleDateString(),
                                verificationCode: verificationCode
                            }, qrData)];
                    case 3:
                        pdfPath = _a.sent();
                        certificate = new visitorCertificate_1.VisitorCertificateModel({
                            certificateId: certificateId,
                            visitorName: visitorName,
                            visitorEmail: visitorEmail,
                            visitorPhone: visitorPhone,
                            certificateTemplate: template,
                            title: title,
                            description: description,
                            qrCode: qrCode,
                            pdfUrl: pdfPath,
                            verificationCode: verificationCode,
                            issueDate: new Date()
                        });
                        return [4 /*yield*/, certificate.save()];
                    case 4:
                        savedCertificate = _a.sent();
                        // Send email
                        return [4 /*yield*/, email_1.sendCertificateEmail({
                                email: visitorEmail,
                                name: visitorName,
                                certificateTitle: title,
                                certificateFile: pdfPath,
                                verificationCode: verificationCode
                            })];
                    case 5:
                        // Send email
                        _a.sent();
                        return [2 /*return*/, __assign(__assign({}, savedCertificate.toObject()), { success: true, message: 'Visitor certificate issued successfully' })];
                    case 6:
                        error_2 = _a.sent();
                        throw new Error("Visitor certificate issuance failed: " + error_2.message);
                    case 7: return [2 /*return*/];
                }
            });
        }); }
    }
};
