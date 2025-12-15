"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const volunteerSchema = new mongoose_1.Schema({
    volunteerId: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    education: {
        type: String
    },
    skills: [String],
    experience: {
        type: String
    },
    areaOfInterest: [String],
    availability: {
        type: String,
        enum: ['fulltime', 'parttime', 'weekends', 'flexible'],
        default: 'flexible'
    },
    volunteerStatus: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'completed'],
        default: 'active'
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    totalHours: {
        type: Number,
        default: 0
    },
    assignedTasks: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Task'
        }
    ],
    certifications: [String],
    backgroundVerified: {
        type: Boolean,
        default: false
    },
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
exports.VolunteerModel = mongoose_1.default.model("Volunteer", volunteerSchema);
