"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonateModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var donateSchema = new mongoose_1.Schema({
    donator: {
        type: String,
        required: true
    },
    donatorEmail: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    payment_method: {
        type: String,
        required: true,
        enum: ['razorpay', 'phonepe', 'payumoney', 'cash', 'bank_transfer', 'upi']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    donation_type: {
        type: String,
        required: true,
        enum: ['one-time', 'monthly', 'campaign', 'general']
    },
    payment_status: {
        type: String,
        enum: ['SUCCESS', 'FAILED', 'PENDING'],
        default: 'PENDING'
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    referredBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiptUrl: {
        type: String
    },
    orderId: {
        type: String,
        index: true
    },
    paymentId: {
        type: String,
        index: true
    },
    signature: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
exports.DonateModel = mongoose_1.default.model("Donate", donateSchema);
