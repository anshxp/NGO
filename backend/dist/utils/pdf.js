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
exports.generateDonationPDF = void 0;
var pdfkit_1 = __importDefault(require("pdfkit"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
exports.generateDonationPDF = function (donation) { return __awaiter(void 0, void 0, void 0, function () {
    var receiptsDir, filePath;
    return __generator(this, function (_a) {
        receiptsDir = path_1.default.join(process.cwd(), 'receipts');
        if (!fs_1.default.existsSync(receiptsDir))
            fs_1.default.mkdirSync(receiptsDir, { recursive: true });
        filePath = path_1.default.join(receiptsDir, "donation_" + donation.transactionId + ".pdf");
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var doc = new pdfkit_1.default({ margin: 50 });
                var stream = fs_1.default.createWriteStream(filePath);
                doc.pipe(stream);
                doc.fontSize(22).fillColor('#333').text('Donation Receipt', { align: 'center' });
                doc.moveDown();
                doc.fontSize(12).text("Transaction ID: " + donation.transactionId);
                doc.text("Donator: " + (donation.isAnonymous ? 'Anonymous' : donation.donator));
                doc.text("Email: " + donation.donatorEmail);
                doc.text("Amount: \u20B9" + donation.amount.toFixed(2));
                doc.text("Donation Type: " + donation.donation_type);
                doc.text("Payment Method: " + donation.payment_method);
                doc.text("Payment Status: " + donation.payment_status);
                if (donation.orderId)
                    doc.text("Order ID: " + donation.orderId);
                if (donation.paymentId)
                    doc.text("Payment ID: " + donation.paymentId);
                doc.text("Date: " + donation.timestamp.toLocaleString());
                doc.moveDown();
                doc.fontSize(10).fillColor('#666').text('Thank you for supporting our mission.', { align: 'center' });
                doc.end();
                stream.on('finish', function () { return resolve(filePath); });
                stream.on('error', reject);
            })];
    });
}); };
