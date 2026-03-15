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
exports.ReceiptModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var receiptSchema = new mongoose_1.Schema({
    receiptId: {
        type: String,
        unique: true,
        required: true
    },
    receiptType: {
        type: String,
        enum: ['membership', 'donation', 'event', 'cash_donation'],
        required: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    referenceId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    transactionId: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    pdfUrl: {
        type: String
    },
    qrCode: {
        type: String
    },
    status: {
        type: String,
        enum: ['issued', 'voided'],
        default: 'issued'
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
exports.ReceiptModel = mongoose_1.default.model("Receipt", receiptSchema);
