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
exports.BeneficiaryModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var beneficiarySchema = new mongoose_1.Schema({
    beneficiaryId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    projects: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Project'
        }
    ],
    helpHistory: [
        {
            projectId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Project'
            },
            helpType: String,
            description: String,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    notes: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
exports.BeneficiaryModel = mongoose_1.default.model("Beneficiary", beneficiarySchema);
