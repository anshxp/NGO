import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVolunteer extends Document {
    volunteerId: string;
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    education: string;
    skills: string[];
    experience: string;
    areaOfInterest: string[];
    availability: 'fulltime' | 'parttime' | 'weekends' | 'flexible';
    volunteerStatus: 'active' | 'inactive' | 'suspended' | 'completed';
    joiningDate: Date;
    totalHours: number;
    assignedTasks: mongoose.Types.ObjectId[];
    certifications: string[];
    backgroundVerified: boolean;
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };
    created_at: Date;
    updated_at: Date;
}

const volunteerSchema: Schema<IVolunteer> = new Schema<IVolunteer>(
    {
        volunteerId: {
            type: String,
            unique: true,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
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
                type: mongoose.Schema.Types.ObjectId,
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
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export const VolunteerModel: Model<IVolunteer> = mongoose.model<IVolunteer>("Volunteer", volunteerSchema);
