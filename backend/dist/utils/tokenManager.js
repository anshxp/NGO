"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenExpired = exports.decodeToken = exports.verifyToken = exports.generateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.generateToken = function (userId, email, role) {
    return jsonwebtoken_1.default.sign({ userId: userId, email: email, role: role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRY || '7d' });
};
exports.verifyToken = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
exports.decodeToken = function (token) {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch (_a) {
        return null;
    }
};
exports.isTokenExpired = function (token) {
    var decoded = exports.decodeToken(token);
    if (!decoded)
        return true;
    var currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp ? currentTime > decoded.exp : true;
};
