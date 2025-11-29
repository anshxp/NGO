import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this';
    return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): any => {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this';
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

export const generateReferralCode = (): string => {
    return `NGO${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
};

export const generateMembershipId = (userId: string): string => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `NGO${year}${userId.substring(0, 4).toUpperCase()}${random}`;
};
