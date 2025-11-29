import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface DecodedToken extends JwtPayload {
    userId: string;
    email: string;
    role: string;
    exp?: number;
    iat?: number;
}

export const generateToken = (userId: string, email: string, role: string): string => {
    return jwt.sign(
        { userId, email, role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRY || '7d' } as jwt.SignOptions
    );
};

export const verifyToken = (token: string): DecodedToken => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwt.decode(token) as DecodedToken;
    } catch {
        return null;
    }
};

export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp ? currentTime > decoded.exp : true;
};
