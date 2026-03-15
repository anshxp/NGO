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
exports.generateReportPDF = exports.generate80GReceipt = exports.generateAppointmentLetter = exports.generateCertificate = exports.generateMembershipIDCard = void 0;
var pdfkit_1 = __importDefault(require("pdfkit"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var qrcode_1 = require("./qrcode");
exports.generateMembershipIDCard = function (memberData, qrCodeData) { return __awaiter(void 0, void 0, void 0, function () {
    var cardsDir, filePath;
    return __generator(this, function (_a) {
        cardsDir = path_1.default.join(process.cwd(), 'membership_cards');
        if (!fs_1.default.existsSync(cardsDir))
            fs_1.default.mkdirSync(cardsDir, { recursive: true });
        filePath = path_1.default.join(cardsDir, "membership_" + memberData.memberId + ".pdf");
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var doc, stream, qrBuffer, error_1, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            doc = new pdfkit_1.default({ size: [400, 250] });
                            stream = fs_1.default.createWriteStream(filePath);
                            doc.pipe(stream);
                            // Header
                            doc.fillColor('#2196F3').rect(0, 0, 400, 60).fill();
                            doc.fillColor('white').fontSize(20).text('NGO Membership', 20, 15, { width: 360 });
                            // Member Details
                            doc.fillColor('#333');
                            doc.fontSize(12).text("ID: " + memberData.memberId, 20, 80);
                            doc.fontSize(14).text("" + memberData.name, 20, 100, { width: 360 });
                            doc.fontSize(10).text("Designation: " + memberData.designation, 20, 125);
                            doc.fontSize(10).text("Email: " + memberData.email, 20, 145);
                            doc.fontSize(10).text("Joined: " + memberData.joinDate, 20, 165);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, qrcode_1.generateQRCodeBuffer(qrCodeData)];
                        case 2:
                            qrBuffer = _a.sent();
                            doc.image(qrBuffer, 280, 80, { width: 100 });
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.log('QR code generation skipped');
                            return [3 /*break*/, 4];
                        case 4:
                            // Footer
                            doc.fillColor('#999').fontSize(8).text('This card is non-transferable. Please preserve it.', 20, 200, { width: 360 });
                            doc.end();
                            stream.on('finish', function () { return resolve(filePath); });
                            stream.on('error', reject);
                            return [3 /*break*/, 6];
                        case 5:
                            error_2 = _a.sent();
                            reject(error_2);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports.generateCertificate = function (certificateData, qrCodeData) { return __awaiter(void 0, void 0, void 0, function () {
    var certificatesDir, filePath;
    return __generator(this, function (_a) {
        certificatesDir = path_1.default.join(process.cwd(), 'certificates');
        if (!fs_1.default.existsSync(certificatesDir))
            fs_1.default.mkdirSync(certificatesDir, { recursive: true });
        filePath = path_1.default.join(certificatesDir, "certificate_" + certificateData.verificationCode + ".pdf");
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var doc, stream, qrBuffer, error_3, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            doc = new pdfkit_1.default({ margin: 40 });
                            stream = fs_1.default.createWriteStream(filePath);
                            doc.pipe(stream);
                            // Decorative border
                            doc.strokeColor('#2196F3').lineWidth(2).rect(50, 50, 500, 600).stroke();
                            doc.strokeColor('#2196F3').lineWidth(1).rect(60, 60, 480, 580).stroke();
                            // Certificate title
                            doc.fillColor('#2196F3').fontSize(36).text('CERTIFICATE OF ACHIEVEMENT', {
                                align: 'center',
                                width: 480
                            });
                            doc.moveDown(2);
                            // Recipient name
                            doc.fillColor('#333').fontSize(24).text(certificateData.recipientName, {
                                align: 'center',
                                width: 480,
                                underline: true
                            });
                            doc.moveDown(2);
                            // Certificate body
                            doc.fillColor('#666').fontSize(12).text('This is to certify that', { align: 'center', width: 480 });
                            doc.text(certificateData.title, { align: 'center', width: 480 });
                            if (certificateData.description) {
                                doc.moveDown();
                                doc.fontSize(11).text(certificateData.description, { align: 'center', width: 480 });
                            }
                            doc.moveDown(2);
                            // Issue date
                            doc.fontSize(10).text("Date of Issue: " + certificateData.issueDate, { align: 'center', width: 480 });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, qrcode_1.generateQRCodeBuffer(qrCodeData)];
                        case 2:
                            qrBuffer = _a.sent();
                            doc.image(qrBuffer, 240, 380, { width: 80 });
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _a.sent();
                            console.log('QR code generation skipped');
                            return [3 /*break*/, 4];
                        case 4:
                            doc.moveDown(6);
                            // Verification code
                            doc.fontSize(8).text("Verification Code: " + certificateData.verificationCode, {
                                align: 'center',
                                width: 480
                            });
                            // Footer
                            doc.fontSize(9).fillColor('#999').text('This certificate is digitally verified and can be authenticated at our portal.', {
                                align: 'center',
                                width: 480
                            });
                            doc.end();
                            stream.on('finish', function () { return resolve(filePath); });
                            stream.on('error', reject);
                            return [3 /*break*/, 6];
                        case 5:
                            error_4 = _a.sent();
                            reject(error_4);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports.generateAppointmentLetter = function (letterData, qrCodeData) { return __awaiter(void 0, void 0, void 0, function () {
    var lettersDir, filePath;
    return __generator(this, function (_a) {
        lettersDir = path_1.default.join(process.cwd(), 'appointment_letters');
        if (!fs_1.default.existsSync(lettersDir))
            fs_1.default.mkdirSync(lettersDir, { recursive: true });
        filePath = path_1.default.join(lettersDir, "appointment_" + letterData.name + "_" + Date.now() + ".pdf");
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var doc_1, stream, qrBuffer, error_5, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            doc_1 = new pdfkit_1.default({ margin: 50 });
                            stream = fs_1.default.createWriteStream(filePath);
                            doc_1.pipe(stream);
                            // Header
                            doc_1.fontSize(16).text('APPOINTMENT LETTER', { align: 'center' });
                            doc_1.moveDown();
                            // Content
                            doc_1.fontSize(12).text("Date: " + new Date().toLocaleDateString(), { align: 'left' });
                            doc_1.moveDown();
                            doc_1.text("Dear " + letterData.name + ",", { align: 'left' });
                            doc_1.moveDown();
                            doc_1.fontSize(11).text("We are pleased to offer you the position of " + letterData.designation + " with our organization.", {
                                width: 450
                            });
                            doc_1.moveDown();
                            doc_1.text('Position Details:', { underline: true });
                            doc_1.moveDown(0.5);
                            doc_1.fontSize(10).text("\u2022 Designation: " + letterData.designation);
                            doc_1.text("\u2022 Start Date: " + letterData.startDate);
                            if (letterData.salaryStipend) {
                                doc_1.text("\u2022 Stipend: \u20B9" + letterData.salaryStipend + "/month");
                            }
                            doc_1.moveDown();
                            doc_1.text('Key Responsibilities:', { underline: true });
                            doc_1.moveDown(0.5);
                            letterData.responsibilities.forEach(function (resp) {
                                doc_1.text("\u2022 " + resp);
                            });
                            doc_1.moveDown(2);
                            doc_1.text('We look forward to your contribution to our mission.', { width: 450 });
                            doc_1.moveDown(2);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, qrcode_1.generateQRCodeBuffer(qrCodeData)];
                        case 2:
                            qrBuffer = _a.sent();
                            doc_1.image(qrBuffer, 400, doc_1.y + 50, { width: 80 });
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _a.sent();
                            console.log('QR code generation skipped');
                            return [3 /*break*/, 4];
                        case 4:
                            doc_1.end();
                            stream.on('finish', function () { return resolve(filePath); });
                            stream.on('error', reject);
                            return [3 /*break*/, 6];
                        case 5:
                            error_6 = _a.sent();
                            reject(error_6);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports.generate80GReceipt = function (receiptData, qrCodeData) { return __awaiter(void 0, void 0, void 0, function () {
    var receiptsDir, filePath;
    return __generator(this, function (_a) {
        receiptsDir = path_1.default.join(process.cwd(), '80g_receipts');
        if (!fs_1.default.existsSync(receiptsDir))
            fs_1.default.mkdirSync(receiptsDir, { recursive: true });
        filePath = path_1.default.join(receiptsDir, "80g_" + receiptData.transactionId + ".pdf");
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var doc, stream, qrBuffer, error_7, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            doc = new pdfkit_1.default({ margin: 40 });
                            stream = fs_1.default.createWriteStream(filePath);
                            doc.pipe(stream);
                            // Header
                            doc.fillColor('#27AE60').fontSize(20).text('80G TAX BENEFIT RECEIPT', { align: 'center' });
                            doc.moveDown();
                            // Receipt Details
                            doc.fontSize(12).fillColor('#333');
                            doc.text("Receipt Number: " + receiptData.transactionId, { width: 450 });
                            doc.text("Date: " + receiptData.date, { width: 450 });
                            doc.moveDown();
                            // Donor Details
                            doc.text('Donor Information:', { underline: true });
                            doc.fontSize(11);
                            doc.text("Name: " + receiptData.donorName, { width: 450 });
                            if (receiptData.panNumber) {
                                doc.text("PAN: " + receiptData.panNumber, { width: 450 });
                            }
                            doc.moveDown();
                            // Donation Details
                            doc.fontSize(12).text('Donation Details:', { underline: true });
                            doc.fontSize(11);
                            doc.text("Amount: \u20B9" + receiptData.amount.toLocaleString('en-IN'), { width: 450 });
                            doc.moveDown();
                            // Tax Benefits
                            doc.fontSize(11).text('80G Tax Benefit Information:', { underline: true });
                            doc.fontSize(10).fillColor('#666');
                            doc.text('This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.', {
                                width: 450
                            });
                            doc.text('Please mention the receipt number while filing your income tax return.', { width: 450 });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, qrcode_1.generateQRCodeBuffer(qrCodeData)];
                        case 2:
                            qrBuffer = _a.sent();
                            doc.image(qrBuffer, 400, 450, { width: 100 });
                            return [3 /*break*/, 4];
                        case 3:
                            error_7 = _a.sent();
                            console.log('QR code generation skipped');
                            return [3 /*break*/, 4];
                        case 4:
                            // Footer
                            doc.fontSize(9).fillColor('#999').text('This is an electronically generated receipt. No signature required.', {
                                align: 'center',
                                width: 450
                            });
                            doc.end();
                            stream.on('finish', function () { return resolve(filePath); });
                            stream.on('error', reject);
                            return [3 /*break*/, 6];
                        case 5:
                            error_8 = _a.sent();
                            reject(error_8);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports.generateReportPDF = function (reportTitle, reportContent) { return __awaiter(void 0, void 0, void 0, function () {
    var reportsDir, timestamp, filePath;
    return __generator(this, function (_a) {
        reportsDir = path_1.default.join(process.cwd(), 'reports');
        if (!fs_1.default.existsSync(reportsDir))
            fs_1.default.mkdirSync(reportsDir, { recursive: true });
        timestamp = new Date().toISOString().split('T')[0];
        filePath = path_1.default.join(reportsDir, reportTitle + "_" + timestamp + ".pdf");
        return [2 /*return*/, new Promise(function (resolve, reject) {
                try {
                    var doc_2 = new pdfkit_1.default({ margin: 40 });
                    var stream = fs_1.default.createWriteStream(filePath);
                    doc_2.pipe(stream);
                    // Title
                    doc_2.fontSize(18).text(reportTitle, { align: 'center' });
                    doc_2.fontSize(10).fillColor('#999').text("Generated on: " + new Date().toLocaleString(), { align: 'center' });
                    doc_2.moveDown(2);
                    // Content sections
                    reportContent.forEach(function (section) {
                        doc_2.fontSize(14).fillColor('#333').text(section.section, { underline: true });
                        doc_2.moveDown();
                        if (Array.isArray(section.data)) {
                            section.data.forEach(function (item) {
                                doc_2.fontSize(11).text("\u2022 " + JSON.stringify(item));
                            });
                        }
                        else {
                            doc_2.fontSize(11).text(JSON.stringify(section.data, null, 2));
                        }
                        doc_2.moveDown();
                    });
                    doc_2.end();
                    stream.on('finish', function () { return resolve(filePath); });
                    stream.on('error', reject);
                }
                catch (error) {
                    reject(error);
                }
            })];
    });
}); };
