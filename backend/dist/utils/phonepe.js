"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPhonePePayment = exports.createPhonePeOrder = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const phonepeConfig = {
    merchantId: process.env.PHONEPE_MERCHANT_ID || '',
    saltKey: process.env.PHONEPE_SALT_KEY || '',
    saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
    baseUrl: process.env.NODE_ENV === 'production'
        ? 'https://api.phonepe.com/apis/hermes'
        : 'https://api-preprod.phonepe.com/apis/hermes'
};
const createPhonePeOrder = async (amount, orderId, redirectUrl) => {
    try {
        const payload = {
            merchantId: phonepeConfig.merchantId,
            transactionId: orderId,
            amount: amount * 100,
            mobileNumber: '',
            redirectUrl: redirectUrl,
            successUrl: `${redirectUrl}?status=success`,
            failureUrl: `${redirectUrl}?status=failed`
        };
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const signature = generatePhonePeSignature(base64Payload);
        const response = await axios_1.default.post(`${phonepeConfig.baseUrl}/pg/v1/pay`, {
            request: base64Payload
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': signature
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('PhonePe order creation failed:', error);
        throw new Error('Failed to create PhonePe payment order');
    }
};
exports.createPhonePeOrder = createPhonePeOrder;
const verifyPhonePePayment = async (transactionId) => {
    try {
        const path = `/pg/v1/status/${phonepeConfig.merchantId}/${transactionId}`;
        const signature = generatePhonePeSignature(path);
        const response = await axios_1.default.get(`${phonepeConfig.baseUrl}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': signature,
                'X-MERCHANT-ID': phonepeConfig.merchantId
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('PhonePe verification failed:', error);
        throw new Error('Failed to verify PhonePe payment');
    }
};
exports.verifyPhonePePayment = verifyPhonePePayment;
const generatePhonePeSignature = (payload) => {
    const base64Hash = crypto_1.default
        .createHash('sha256')
        .update(payload + phonepeConfig.saltKey)
        .digest('base64');
    return `${base64Hash}###${phonepeConfig.saltIndex}`;
};
