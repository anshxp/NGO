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
exports.ProjectModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var projectSchema = new mongoose_1.Schema({
    projectId: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    objective: {
        type: String
    },
    totalBudget: {
        type: Number,
        required: true
    },
    fundsReceived: {
        type: Number,
        default: 0
    },
    expenses: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['planning', 'active', 'completed', 'paused'],
        default: 'planning'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    imageUrl: {
        type: String
    },
    organizer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donors: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    beneficiaries: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Beneficiary'
        }
    ],
    reports: [
        {
            type: String
        }
    ]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
exports.ProjectModel = mongoose_1.default.model("Project", projectSchema);
