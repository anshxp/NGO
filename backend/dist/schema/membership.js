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
exports.MembershipModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var membershipSchema = new mongoose_1.Schema({
    memberId: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    designationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Designation',
        required: true
    },
    membershipStatus: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'expired'],
        default: 'active'
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date
    },
    membershipFee: {
        type: Number,
        required: true
    },
    receiptUrl: {
        type: String
    },
    idCardUrl: {
        type: String
    },
    appointmentLetterUrl: {
        type: String
    },
    qrCode: {
        type: String
    },
    renewalDate: {
        type: Date
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
exports.MembershipModel = mongoose_1.default.model("Membership", membershipSchema);
