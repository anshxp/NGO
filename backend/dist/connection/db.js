"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME || 'ngo_db',
        });
        console.log("✅ Database Connected Successfully");
    }
    catch (error) {
        console.error("❌ MongoDB Connection Error: ", error);
        throw error;
    }
};
exports.connectDB = connectDB;
