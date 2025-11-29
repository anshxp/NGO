"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPaymentDetails = exports.verifyRazorpaySignature = exports.createRazorpayOrder = exports.razorpayInstance = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.razorpayInstance = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});
const createRazorpayOrder = async (amount, receipt) => {
    try {
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: 'INR',
            receipt: receipt,
            payment_capture: 1
        };
        const order = await exports.razorpayInstance.orders.create(options);
        return order;
    }
    catch (error) {
        console.error('Razorpay order creation failed:', error);
        throw new Error('Failed to create payment order');
    }
};
exports.createRazorpayOrder = createRazorpayOrder;
const verifyRazorpaySignature = (orderId, paymentId, signature) => {
    try {
        const secret = process.env.RAZORPAY_KEY_SECRET || '';
        const generatedSignature = crypto_1.default
            .createHmac('sha256', secret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');
        return generatedSignature === signature;
    }
    catch (error) {
        console.error('Signature verification failed:', error);
        return false;
    }
};
exports.verifyRazorpaySignature = verifyRazorpaySignature;
const fetchPaymentDetails = async (paymentId) => {
    try {
        const payment = await exports.razorpayInstance.payments.fetch(paymentId);
        return payment;
    }
    catch (error) {
        console.error('Failed to fetch payment details:', error);
        throw new Error('Failed to fetch payment details');
    }
};
exports.fetchPaymentDetails = fetchPaymentDetails;
