import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            dbName: process.env.DB_NAME as string || 'ngo_db',
        });
        console.log("✅ Database Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error: ", error);
        throw error;
    }
}
