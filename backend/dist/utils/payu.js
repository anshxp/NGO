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
exports.verifyPayUPayment = exports.createPayUOrder = void 0;
var crypto_1 = __importDefault(require("crypto"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var payuConfig = {
    merchantKey: process.env.PAYU_MERCHANT_KEY || '',
    merchantSalt: process.env.PAYU_MERCHANT_SALT || '',
    baseUrl: process.env.NODE_ENV === 'production'
        ? 'https://secure.payu.in'
        : 'https://test.payu.in'
};
exports.createPayUOrder = function (amount, orderId, userEmail, userName, redirectUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var txnid, hash, formData, entries_1;
    return __generator(this, function (_a) {
        try {
            txnid = orderId;
            hash = generatePayUHash(txnid, amount);
            formData = new URLSearchParams({
                key: payuConfig.merchantKey,
                txnid: txnid,
                amount: amount.toString(),
                productinfo: 'NGO Donation',
                firstname: userName,
                email: userEmail,
                phone: '',
                surl: redirectUrl + "?status=success",
                furl: redirectUrl + "?status=failed",
                hash: hash
            });
            entries_1 = {};
            formData.forEach(function (value, key) {
                entries_1[key] = value;
            });
            // Return the form data for frontend form submission
            return [2 /*return*/, {
                    baseUrl: payuConfig.baseUrl + "/_payment",
                    formData: entries_1
                }];
        }
        catch (error) {
            console.error('PayU order creation failed:', error);
            throw new Error('Failed to create PayU payment order');
        }
        return [2 /*return*/];
    });
}); };
exports.verifyPayUPayment = function (txnid, amount, productinfo, firstname, email, status, hash) { return __awaiter(void 0, void 0, void 0, function () {
    var verifyHash;
    return __generator(this, function (_a) {
        try {
            verifyHash = generatePayUHash(txnid, parseFloat(amount));
            if (verifyHash !== hash) {
                console.error('PayU hash verification failed');
                return [2 /*return*/, false];
            }
            return [2 /*return*/, status === 'success'];
        }
        catch (error) {
            console.error('PayU verification failed:', error);
            return [2 /*return*/, false];
        }
        return [2 /*return*/];
    });
}); };
var generatePayUHash = function (txnid, amount) {
    var hashString = payuConfig.merchantKey + "|" + txnid + "|" + amount + "|NGO Donation|||udf1|udf2|udf3|udf4|udf5||" + payuConfig.merchantSalt;
    return crypto_1.default
        .createHash('sha512')
        .update(hashString)
        .digest('hex');
};
