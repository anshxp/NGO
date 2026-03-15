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
exports.VisitorCertificateModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var visitorCertificateSchema = new mongoose_1.Schema({
    certificateId: {
        type: String,
        unique: true,
        required: true
    },
    visitorName: {
        type: String,
        required: true
    },
    visitorEmail: {
        type: String,
        required: true
    },
    visitorPhone: {
        type: String,
        required: true
    },
    certificateTemplate: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    pdfUrl: {
        type: String
    },
    qrCode: {
        type: String
    },
    verificationCode: {
        type: String,
        unique: true,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
exports.VisitorCertificateModel = mongoose_1.default.model("VisitorCertificate", visitorCertificateSchema);
