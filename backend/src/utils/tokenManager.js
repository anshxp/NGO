import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const generateToken = (userId, email, role) => {
    return jwt.sign({ userId, email, role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRY || '7d' });
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    }
    catch {
        return null;
    }
};
export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded)
        return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp ? currentTime > decoded.exp : true;
};
