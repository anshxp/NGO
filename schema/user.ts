import mongoose, { Model, Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    firstname: string;
    lastname: string;
    contact:Number;
    email: string;
    password: string;
    role: 'admin' | 'volunteer';
}

const userSchema: Schema<IUser> = new Schema<IUser>(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        contact:{type:Number,required:true},
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'volunteer'] as const, default: 'volunteer' },
    },
    {
        timestamps: true,
    }
);

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);