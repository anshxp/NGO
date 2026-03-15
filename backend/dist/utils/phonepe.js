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
exports.verifyPhonePePayment = exports.createPhonePeOrder = void 0;
var axios_1 = __importDefault(require("axios"));
var crypto_1 = __importDefault(require("crypto"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var phonepeConfig = {
    merchantId: process.env.PHONEPE_MERCHANT_ID || '',
    saltKey: process.env.PHONEPE_SALT_KEY || '',
    saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
    baseUrl: process.env.NODE_ENV === 'production'
        ? 'https://api.phonepe.com/apis/hermes'
        : 'https://api-preprod.phonepe.com/apis/hermes'
};
exports.createPhonePeOrder = function (amount, orderId, redirectUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, base64Payload, signature, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                payload = {
                    merchantId: phonepeConfig.merchantId,
                    transactionId: orderId,
                    amount: amount * 100,
                    mobileNumber: '',
                    redirectUrl: redirectUrl,
                    successUrl: redirectUrl + "?status=success",
                    failureUrl: redirectUrl + "?status=failed"
                };
                base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
                signature = generatePhonePeSignature(base64Payload);
                return [4 /*yield*/, axios_1.default.post(phonepeConfig.baseUrl + "/pg/v1/pay", {
                        request: base64Payload
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-VERIFY': signature
                        }
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_1 = _a.sent();
                console.error('PhonePe order creation failed:', error_1);
                throw new Error('Failed to create PhonePe payment order');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.verifyPhonePePayment = function (transactionId) { return __awaiter(void 0, void 0, void 0, function () {
    var path, signature, response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                path = "/pg/v1/status/" + phonepeConfig.merchantId + "/" + transactionId;
                signature = generatePhonePeSignature(path);
                return [4 /*yield*/, axios_1.default.get("" + phonepeConfig.baseUrl + path, {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-VERIFY': signature,
                            'X-MERCHANT-ID': phonepeConfig.merchantId
                        }
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_2 = _a.sent();
                console.error('PhonePe verification failed:', error_2);
                throw new Error('Failed to verify PhonePe payment');
            case 3: return [2 /*return*/];
        }
    });
}); };
var generatePhonePeSignature = function (payload) {
    var base64Hash = crypto_1.default
        .createHash('sha256')
        .update(payload + phonepeConfig.saltKey)
        .digest('base64');
    return base64Hash + "###" + phonepeConfig.saltIndex;
};
